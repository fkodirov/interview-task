import React from "react";
import classNames from "classnames";
import style from "./FormText.module.scss";

export interface IFormTextProps extends Omit<React.HTMLProps<HTMLInputElement>, "size"> {
  isValid?: boolean;
  isInvalid?: boolean;
  error?: string | boolean;
  size?: "sm" | "lg";
  length?: number;
  label?: string;
  onClear?: () => void;
  Icon?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
}

const FormText = React.forwardRef<HTMLInputElement, IFormTextProps>(
  ({ className, isValid, Icon, isInvalid, label, error, size, length, onClear, ...props }, ref) => {
    const handleClear = () => {
      if (onClear) onClear();
    };
    return (
      <div
        className={classNames(className, style.formText, {
          [style.invalid]: isInvalid,
          [style.valid]: isValid,
          [style.lg]: size === "lg",
          [style.sm]: size === "sm",
          [style.hasIcon]: !!Icon,
        })}
      >
        {label && (
          <label className={style.formLabel} htmlFor={props.id}>
            {label}
          </label>
        )}
        {Icon && <Icon className={style.icon} />}
        <input ref={ref} type="text" {...props} size={length} />
        {error && isInvalid && (
          <div className={classNames(style.feedback)}>
            {error}
          </div>
        )}
        {onClear && (
          <button type="button" className={style.clear} aria-label="clear" onClick={handleClear}>
            clear
          </button>
        )}
      </div>
    );
  },
);
FormText.displayName = "FormText";
export default FormText;
