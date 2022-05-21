import { useContext } from "react"
// import component
import Input from "../../form/Input"
import { Link } from "react-router-dom"

// Import css
import styles from '../../form/Form.module.css'
import React from "react"

// import Context
import { Context } from "../../../context/UserContext"

const Register = () => {
  const [user, setUser] = React.useState({})
  const { register } = useContext(Context)

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value})
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Enviar usuário para o banco
    register(user)
  }

  return(
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Name"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
           />
          <Input
          text="Telephone"
          type="text"
          name="phone"
          placeholder="Digite o seu telephone"
          handleOnChange={handleChange}
            />
          <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu E-mail"
          handleOnChange={handleChange}
            />
          <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
            />
          <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
            />
          <input type="submit" value="Cadastrar" />
      </form>
      <p>Já tem conta? <Link to='/login'>Clique aqui.</Link></p>
    </section>
  )
}

export default Register