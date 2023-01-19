/// MEGA HACKS

import { useRef, useState, RefObject, useEffect } from 'react';
import type TMonaco from 'monaco-editor';
import { useMediaQuery } from './hooks.js';
import config from "~/yconfig";

// https://cdnjs.com/libraries/monaco-editor
const baseUrl =
  // 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min';
  `${config.urlPrefix.replace('\/index\.html', '')}/min`

const integrity =
  'sha512-dx6A3eMO/vvLembE8xNGc3RKUytoTIX3rNO5uMEhzhqnXYx1X5XYmjfZP7vxYv7x3gBhdj7Pgys8DUjdbDaLAA==';


/*
  Load Monaco from CDN

  (seemed easier than importing with snowpack)

  https://github.com/microsoft/monaco-editor/blob/master/docs/integrate-amd-cross.md#option-1-use-a-data-worker-uri
*/
const monacoPromised = (async () => {
  // hide how hacky I am from TypeScript
  const win = window as any;

  /*
    Step 1, load the monaco loader (adds window.require)
  */
  if (!win.require) {// hmr
    const scr = document.createElement('script');
    scr.setAttribute('src', `${baseUrl}/vs/loader.js`);
    // scr.setAttribute('integrity', integrity);
    scr.setAttribute('crossorigin', 'anonymous');

    const load = new Promise((res) => scr.addEventListener('load', res));
    document.head.append(scr);

    await load;
  }

  /*
    Step 2, load monaco (adds window.monaco)
  */
  if (!win.monaco) {// hmr
    win.require.config({ paths: { vs: `${baseUrl}/vs` } });

    win.MonacoEnvironment = { getWorkerUrl: () => proxy };
    let proxy = URL.createObjectURL(
      new Blob(
        [
          `
        self.MonacoEnvironment = { baseUrl: '${baseUrl}' };
        importScripts('${baseUrl}/vs/base/worker/workerMain.js');
        `,
        ],
        { type: 'text/javascript' },
      ),
    );

    await new Promise((res) => win.require(['vs/editor/editor.main'], res));
  }

  return win.monaco as typeof TMonaco;
})();

/** last step in a series of hacks */
export const useMonaco = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<TMonaco.editor.IStandaloneCodeEditor>();
  const [mon, setMon] = useState<typeof TMonaco>();

  const lightMode = useMediaQuery('(prefers-color-scheme: light)');
  useEffect(() => {
    if (mon) {
      (mon as any).editor.setTheme(lightMode ? 'vs-light' : 'vs-dark');
    }
  }, [mon, lightMode]);

  useEffect(() => {
    monacoPromised.then((mon) => {
      // fixme: invariant(ref.current)
      const ed = mon.editor.create(ref.current!, {
        value: '',
        wordWrap: 'on',
      });

      setMon(mon);
      setEditor(ed);
    });
  }, []);
  useEffect(() => {
    if (editor) {
      const resize = () => {
        editor.layout();
      };
      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('resize', resize);
      };
    }
  }, [editor]);

  return [ref, editor, mon] as [
    RefObject<HTMLDivElement>,
    TMonaco.editor.IStandaloneCodeEditor?,
    typeof TMonaco?,
  ];
};
