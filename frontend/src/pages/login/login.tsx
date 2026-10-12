import style from "./login.module.css"
import { Text } from "../../components/Text/text"
import { Button } from "../../components/button/button"

export const login = () => {
  return (
    <div className={style.login}>
      <form className={style.form}>
        <Text variant="h1">Welcome Back</Text>
        <Text variant="p">Log in to your account</Text>

          <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email" 
            />

  
          <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
          />

          <Button label="Log in"  type="submit" />
           
           <Text variant="p" className={style.signup}>
            Don't have an account? <a href="/signup">Sign up</a>
          </Text>
        
        <div/>
      </form>
    </div>
  )
}