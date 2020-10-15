import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout'
import { urlClient, urlServer } from '../../constant'

const FormStyles = styled.form`
  padding: 0 20rem;

  .form-group {
    margin-bottom: 2rem;
    font-size: 1.6rem;
    font-weight: 300;

    input,
    textarea,
    select {
      margin-top: 1rem;
      min-height: 40px;
    }
  }

  .error {
    color: red;
    margin: 1rem 0;
  }
  
  button {
    padding: 1rem 1.5rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
  }

  @media (max-width: 700px) {
    & {
      padding: 0;
    }
  }
`

const EditProduct = ({ user, product }) => {
  const router = useRouter()
  const [categories, setCategories] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const { handleSubmit, errors, register, setValue } = useForm()

  useEffect(() => {
    fetchCategory()
    if (product.length) {
      setCategoryId(product[0].category_id)
      setValue('product_name', product[0].product_name)
      setValue('description', product[0].description)
      setValue('price', product[0].price)
      setValue('sale_price', product[0].sale_price)
    }
  }, [])

  const fetchCategory = async () => {
    const response = await fetch(`${urlServer}/category`)
    const { result } = await response.json()
    setCategories(result)
  }

  const onSubmit = async values => {
    const formData = new FormData()
    for (let [key, value] of Object.entries(values)) {
      if (key === 'feature_image') {
        formData.append('feature_image', value[0])
      } else if (key === 'product_id') {
        formData.append('product_id', value)
      } else {
        formData.append(key, value)
      }
    }

    const response = await fetch(`${urlServer}/product`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData
    })
    const { error, result } = await response.json()
    if (!error) router.push(`${urlClient}`)
  }

  return (
    <Layout user={user}>
      <div className="container">
        <FormStyles onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="product_id" ref={register()} value={product[0].id || ''} />
          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select value={product[0].category_id} name="category_id"
              id="category_id"
              value={categoryId || ''}
              onChange={event => setCategoryId(event.target.value)}
              ref={register({
                required: "Required",
              })}>
              {
                categories && (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>{category.category_name}</option>
                  ))
                )
              }
            </select>
            {errors.category_id && errors.category_id.type === "required" && (
              <p className="error">Product name is required</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="product_name">Product Name</label>
            <input
              name="product_name"
              id="product_name"
              ref={register({
                required: "Required",
              })}
            />
            {errors.product_name && errors.product_name.type === "required" && (
              <p className="error">Product name is required</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              rows={10}
              id="description"
              ref={register({
                required: "Required",
              })}
            />
            {errors.description && errors.description.type === "required" && (
              <p className="error">Description is required</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              name="price"
              id="price"
              ref={register({
                required: "Required",
                pattern: {
                  value: /^[0-9]/g,
                }
              })}
            />
            {errors.price && errors.price.type === "required" && (
              <p className="error">Price is required</p>
            )}
            {errors.price && errors.price.type === "pattern" && (
              <p className="error">Number only</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="sale_price">Sale Price</label>
            <input
              name="sale_price"
              id="sale_price"
              ref={register({
                required: "Required",
                pattern: {
                  value: /^[0-9]/g,
                }
              })}
            />
            {errors.sale_price && errors.sale_price.type === "required" && (
              <p className="error">Sale Price is required</p>
            )}
            {errors.sale_price && errors.sale_price.type === "pattern" && (
              <p className="error">Number only</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="feature_image">Feature Image</label>
            <input
              name="feature_image"
              id="feature_image"
              type="file"
              ref={register()}
            />
            {errors.feature_image && errors.feature_image.type === "required" && (
              <p className="error">Image is required</p>
            )}
          </div>
          <div className="form-group">
            <img src={`${product[0].feature_image}`} alt={`${product[0].product_name}`} width="200" height="200" />
          </div>
          <button type="submit">Submit</button>
        </FormStyles>
      </div>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.params

  const response = await fetch(`${urlServer}/product/${slug}`)
  const { error, result } = await response.json()

  if (error) return

  return {
    props: {
      product: result
    }
  }
}

export default EditProduct