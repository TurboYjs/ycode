import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PickFile } from '~components/PickFile';
import yconfig from './yconfig';
import Editor from './components/Editor';
import Select from "~components/Select";
import Button from "~components/Button";
interface AppProps {}

function App({}: AppProps) {
    const [fileHandle, setFileHandle] = useState<FileSystemFileHandle>();

    const write = async (str: string) => {
        if (fileHandle) {
            const writable = await fileHandle.createWritable();
            await writable.write(str);
            await writable.close();
        }
    };

    useEffect(() => {
        if (fileHandle) {
            fileHandle
                .getFile()
                .then((file) => file.text())
                .then((text) => {
                    const tdoc = yconfig.doc.getText('monaco:content');

                    // hack?, clear out contents
                    if (tdoc.toJSON()) tdoc.delete(0, 1000000);
                    tdoc.insert(0, text);

                    const namedoc = yconfig.doc.getText('monaco:name');

                    // hack?, clear out contents
                    if (namedoc.toJSON()) namedoc.delete(0, 1000000);
                    namedoc.insert(0, fileHandle.name);
                    history.pushState('', '', `${yconfig.urlPrefix}?room=${yconfig.room}`);
                });
        }
    }, [fileHandle]);

    useEffect(() => {
        document.title = fileHandle ? fileHandle.name : 'collaborate';
    }, [fileHandle]);
    const onStart = ()=> {
        window.location.href = `${yconfig.urlPrefix}?room=${yconfig.room}&language=${language}`
    }
    const [language, setLanguage] = useState('typescript')

    if (yconfig.initiator) {
        return (
           <div className="flex flex-col mt-10 items-center gap-5">
               <PickFile onFile={setFileHandle} file={fileHandle}>
                   <Editor onChange={write} />
               </PickFile>
               <p className="text-xl font-bold" >
                   Select a lang to get start
               </p>
               <div className="flex gap-1">
                   <Select options={[{label: 'typescript', value: 'typescript'}]} value={language} onChange={setLanguage}  defaultValue={'typescript'}></Select>
                   <Button onClick={onStart}>Start</Button>
               </div>
           </div>
        );
    } else {
        return <Editor onChange={() => console.warn('save ignored')} />;
    }
}

export default App;
