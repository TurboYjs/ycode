import classnames from 'classnames';
import * as React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  border?: boolean;
}

function Component(props: Props) {
  const { placeholder, border, className, ...restProps } = props;

  return (
    <textarea
      className={classnames(
        'textarea',
        {
          'textarea-bordered': border,
        },
        className
      )}
      placeholder={placeholder}
      {...restProps}
    ></textarea>
  );
}

export default Component;
