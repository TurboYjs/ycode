/// MEGA HACKS

import React, {
  useState,
  useEffect,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import type * as Y from 'yjs';
import style from './monaco.module.css';

import { MonacoBinding, _SET_MONACO } from '../ext/y-monaco.js';

import yconfig from '../yconfig';

import { useMonaco } from './monaco.jsx';
import Operator from '~components/Operator'
export const Editor: FC<{
  // name?: string;
  onChange: (s: string) => void;
}> = ({ onChange }) => {
  const [ref, editor, mon] = useMonaco();

  const [changed, setChanged] = useState(false);

  const [name, setName] = useState<string>();

  const [help, setHelp] = useState(true);

  useEffect(() => {
    const name = yconfig.doc.getText('monaco:name');

    let val = name.toJSON();

    const callback = (f: Y.YTextEvent) => {
      if (f.adds.length) {
        const current = name.toJSON();
        if (current !== val) {
          setName(current);
          val = current;
        }
      }
    };
    name.observe(callback);

    return () => {
      name.unobserve(callback);
    };
  }, []);

  useEffect(() => {
    const language = yconfig.language
    if (editor && mon) {
      const model = mon.editor.createModel('_', language??undefined, name ? mon.Uri.file(name): undefined);

      let first = true;
      model.onDidChangeContent(() => {
        if (!first) {
          setChanged(true);
        }
        first = false;
      });

      const type = yconfig.doc.getText('monaco:content');

      _SET_MONACO(mon);

      new MonacoBinding(
        type,
        model,
        new Set([editor]),
        yconfig.provider.awareness,
      );

      editor.setModel(model);

      return () => {
        model.dispose();
      };
    }
  }, [editor, name]);

  const down: KeyboardEventHandler = (e) => {
    if (
      (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
      e.key == 's'
    ) {
      e.preventDefault();

      const v = editor?.getValue();
      if (v) {
        onChange(v);
        setChanged(false);
        setHelp(false);
      }
    }
  };

  // copy to clipboard
  const [copied, setCopied] = useState(false);
  const clip: MouseEventHandler<HTMLAnchorElement> = async (e) => {
    e.preventDefault();
    const href = location.href

    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
    } catch (e) {
      // fallback to open in new window
      window.open(href);
    }
  };

  useEffect(() => {
    if (copied) {
      const time = setTimeout(setCopied, 2000, false);

      return () => {
        clearTimeout(time);
      };
    }
  }, [copied]);

  return (
    <div className={style.container} onKeyDown={down}>
      {yconfig.initiator && (
        <header className={style.header}>
          <span>
            {name} {changed && '*'}
          </span>

          {changed && help && (
            <span className={style.saveHint}>
              [use `⌘ + s` to save changes]
            </span>
          )}

          <a onClick={clip} className="cursor-pointer">
            {copied ? 'link copied!' : 'share ↗︎'}
          </a>
        </header>
      )}
      {!yconfig.initiator && (
          <header className={style.header}>
          <span>
            {name} {changed && '*'}
          </span>
            <a onClick={clip} className="cursor-pointer">
              {copied ? 'link copied!' : 'share ↗︎'}
            </a>
          </header>
      )}
      <div className={style.main} ref={ref} />
      <Operator getEditor={()=> editor}/>
    </div>
  );
};

export default Editor;
