import React from 'react'
import { StyledLogin } from './style'
import { useForm } from "react-hook-form";

const Login = () => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      example: "",
      exampleRequired: ""
    }
  });

  return (
    <StyledLogin>
      <form
        onSubmit={handleSubmit((data) => {
          alert(JSON.stringify(data));
        })}
      >
        <label>Example</label>
        <input {...register("example")} defaultValue="test" />
        <label>ExampleRequired</label>
        <input
          {...register("exampleRequired", { required: true, maxLength: 10 })}
        />
        {errors.exampleRequired && <p>This field is required</p>}
        <input type="submit" />
      </form>
    </StyledLogin>
  )
}

export default Login