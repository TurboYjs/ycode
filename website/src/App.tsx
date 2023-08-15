import React, { useState, useEffect, lazy, Suspense } from 'react';
import yconfig from './yconfig';
import Editor from './components/Editor';
import Select from "~components/Select";
import Button from "~components/Button";
interface AppProps {}

function App({}: AppProps) {
    const onStart = ()=> {
        window.location.href = `${yconfig.urlPrefix}?room=${yconfig.room}&language=${language}`
    }
    const [language, setLanguage] = useState('typescript')

    if (yconfig.initiator) {
        return (
           <div className="flex flex-col mt-10 items-center gap-5">
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
