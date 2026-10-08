import styles from './Button.module.css'

export interface ButtonProps{
    label: string;
    onClick?: () => void;
    style?: React.CSSProperties;
    className?: string;
    type?: "button" | "submit"

}

export const Button:React.FC<ButtonProps> = ({label,onClick,style,className,type="button"}) => {

  return (
    <button type={type} onClick={onClick} style={style} className={`${styles.button} ${className || "" }`}>
        {label}
    </button>
  )
}