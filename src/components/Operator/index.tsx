import useRequest from 'ahooks/lib/useRequest';
import classnames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '~components/Button';
import { toast } from '~components/Toast';
import { runCode } from '~services/code';
import Tabs from '~components/Tabs';
import TextArea from '~components/Textarea';
import styles from './index.module.css';
import { editor } from 'monaco-editor';
import { observer } from 'mobx-react-lite';
import {parseConsoleOutput} from "~utils/helper";
import {CodeType} from "~utils/codeType";
enum DisplayType {
  input,
  output,
}

const runCodeInterval = 2000;

interface Props {
  getEditor: () => editor.IStandaloneCodeEditor | null | undefined;
}

function Index(props: Props) {
  const { getEditor } = props;
  const inputRef = useRef('');
  const [display, setDisplay] = useState(DisplayType.output);
  const { data, run, loading } = useRequest(runCode, { manual: true });

  const output = useMemo(() => {
    let output = '';
    if (data?.code) {
      output = data?.message || '';
    } else {
      output = data?.output || '';
    }
    return parseConsoleOutput(output);
  }, [data]);


  const [timesPrevent, setTimesPrevent] = useState(false);

  const handleRunCode = async () => {
    if (timesPrevent) {
      toast({ message: 'You click too fast! Please try it later!', type: 'info' });
      return;
    }

    if (getEditor()) {
      const code = getEditor()?.getValue() || '';
      run({ code: encodeURI(code), type: getEditor()?.getModel?.()?.getLanguageId?.() as CodeType, stdin: inputRef.current });
      setTimesPrevent(true);
      setTimeout(() => {
        setTimesPrevent(false);
      }, runCodeInterval);
    }
  };
  useEffect(() => {
    if (loading) {
      setDisplay(DisplayType.output);
    }
  }, [loading]);

  const renderInput = () => {
    return (
      <TextArea
        onChange={(e) => {
          inputRef.current = e.target.value;
        }}
        className={'w-full h-full mt-1'}
        style={{
          display: display === DisplayType.input ? 'block' : 'none',
        }}
        placeholder="stdin..."
        border
      />
    );
  };

  const renderOutput = () => {
    return (
      <div
        className={classnames(styles.output, 'mt-1', 'text-gray-600')}
        style={{ display: display === DisplayType.output ? 'block' : 'none' }}
      >
        {loading ? (
          'running...'
        ) : output.length ? (
          output.map((str, index) => (
            <pre className="text-gray-800" key={index}>
              {str}
            </pre>
          ))
        ) : (
          <span className="text-sm text-gray-400">output...</span>
        )}
      </div>
    );
  };
  const handleExit = ()=> {
    window.location.href = location.origin
  }
  return (
    <div className={styles.container}>
      <div className={classnames(styles.operator, 'pt-2')}>
        <Button
          type="primary"
          className="mr-2"
          loading={loading}
          onClick={handleRunCode}
        >
          run
        </Button>
        <Button
            type="secondary"
            className="mr-2"
            onClick={handleExit}
        >
          exit
        </Button>
      </div>
      <div className={classnames(styles.display)}>
        <Tabs<DisplayType>
          tabs={[
            { label: 'Input', value: DisplayType.input },
            { label: 'Output', value: DisplayType.output },
          ]}
          active={display}
          lifted
          size="md"
          onChange={(type) => setDisplay(type)}
        />

        {renderInput()}
        {renderOutput()}
      </div>
    </div>
  );
}

export default observer(Index);
