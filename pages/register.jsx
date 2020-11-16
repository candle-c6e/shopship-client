import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Layout from "../components/Layout";

const AuthStyles = styled.div`
  min-height: 80vh;
  height: 80vh;

  .container {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .link-page {
    font-weight: 300;
    font-size: 1.6rem;
    margin: 2rem 0;

    a {
      color: var(--green);
      text-decoration: underline;
    }
  }

  .response-error {
    color: red;
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 2rem;
  }

  @media (max-width: 500px) {
    & {
      height: auto;
      min-height: auto;
    }
  }
`;

const FormStyles = styled.form`
  width: 50rem;
  margin: 0 auto;
  padding: 3rem;
  border: 1px solid var(--border);

  .form-group {
    margin-bottom: 2rem;
    font-size: 1.6rem;
    font-weight: 300;
  }

  .error {
    color: red;
    margin: 1rem 0;
  }

  label {
    color: var(--black);
  }

  input {
    margin-top: 1rem;
    padding: 1rem 0;
    border: none;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
  }

  button {
    padding: 1rem 1.5rem;
    background: transparent;
    border: 1px solid var(--green);
    color: var(--green);
    border-radius: 0.5rem;
    cursor: pointer;
  }
`;

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = async (values) => {
    const response = await fetch(
      `https://jjams.co/api/shopship/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      }
    );
    const { error, msg, result } = await response.json();
    if (error) {
      return setErrorMessage(msg);
    }

    router.push("/");
  };

  return (
    <Layout>
      <AuthStyles>
        <div className="container">
          <FormStyles onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                ref={register({
                  required: "Required",
                  minLength: 3,
                })}
              />
              {errors.name && errors.name.type === "required" && (
                <p className="error">name is required</p>
              )}
              {errors.name && errors.name.type === "minLength" && (
                <p className="error">
                  username is contains at least 3 characters
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && errors.email.type === "required" && (
                <p className="error">email is required</p>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                name="username"
                ref={register({
                  required: "Required",
                  minLength: 3,
                })}
              />
              {errors.username && errors.username.type === "required" && (
                <p className="error">username is required</p>
              )}
              {errors.username && errors.username.type === "minLength" && (
                <p className="error">
                  username is contains at least 3 characters
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                ref={register({
                  required: "Required",
                  minLength: 3,
                })}
              />
              {errors.password && errors.password.type === "required" && (
                <p className="error">password is required</p>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <p className="error">
                  password is contains at least 3 characters
                </p>
              )}
            </div>
            <p className="link-page">
              Already have account?{" "}
              <Link href={`/login`}>
                <a>login</a>
              </Link>
            </p>
            {errorMessage && <p className="response-error">{errorMessage}</p>}
            <button type="submit">Submit</button>
          </FormStyles>
        </div>
      </AuthStyles>
    </Layout>
  );
};

export default Register;
