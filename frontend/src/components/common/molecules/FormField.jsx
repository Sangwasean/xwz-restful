import Input from "../atoms/Input"
import Select from "../atoms/Select"

const FormField = ({ type = "text", label, id, error, options = [], ...props }) => {
  if (type === "select") {
    return <Select label={label} id={id} options={options} error={error} {...props} />
  }

  return <Input type={type} label={label} id={id} error={error} {...props} />
}

export default FormField
