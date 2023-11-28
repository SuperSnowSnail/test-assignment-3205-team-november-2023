import { useState, useRef } from 'react';
import { useFormik } from 'formik';
import { IMaskInput } from 'react-imask';
import spinner from './assets/spinner.svg';
import './App.css';

import schema from 'schema';

/* There will be abort controller */
let controller;

function App() {
  const [users, setUsers] = useState([]);

  /* Refs for Imask */
  const ref = useRef(null);
  const inputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      number: '',
    },
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values, { setSubmitting }) => {
      /* Hack for spinner to work properly */
      setTimeout(() => {
        setSubmitting(true);
      }, 0);

      if (controller) {
        /* If controller exists, it means that we have unresolved request to server, we aborting that request in order to send new request */
        controller.abort();
      }
      /* Defining new controller for new request */
      controller = new AbortController();

      const params = new URLSearchParams(values.number ? values : { email: values.email });
      fetch(`/api/users?${params}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((result) => {
          setUsers(result.users);
          /* When request has been resolved, we erasing controller */
          controller = null;
          setSubmitting(false);
        })
        .catch((err) => {
          setSubmitting(false);
          if (err.name === 'AbortError') {
            return;
          } else {
            setSubmitting(false);
            throw err;
          }
        });
    },
  });

  const isInvalidEmail = formik.errors.email && formik.touched.email;
  const isInvalidNumber = formik.errors.number && formik.touched.number;

  return (
    <>
      <form className='form' onSubmit={formik.handleSubmit}>
        <div>
          <label className='label' htmlFor='email'>
            Email
          </label>
          <input
            className={isInvalidEmail ? 'input invalid' : 'input'}
            type='email'
            id='email'
            name='email'
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldError('email', null);
            }}
            value={formik.values.email}
          />
          {isInvalidEmail && <p className='error'>{formik.errors.email}</p>}
        </div>

        <div>
          <label className='label' htmlFor='number'>
            Number
          </label>
          <IMaskInput
            className={isInvalidNumber ? 'input invalid' : 'input'}
            id='number'
            name='number'
            mask='00-00-00'
            value={formik.values.number}
            unmask={true}
            ref={ref}
            inputRef={inputRef}
            onAccept={(unmaskedValue) => {
              formik.setFieldValue('number', unmaskedValue);
              formik.setFieldError('number', null);
            }}
          />
          {isInvalidNumber && <p className='error'>{formik.errors.number}</p>}
        </div>

        <button className='button' type='submit'>
          Submit
        </button>
      </form>

      <div className='list'>
        <h2>List of users:</h2>
        {formik.isSubmitting && <img src={spinner} alt='Loading' className='spinner' />}

        {!formik.isSubmitting &&
          (users.length > 0 ? (
            users.map(({ email, number }, index) => (
              <div className='card' key={index}>
                <div>
                  <p className='card__title'>Email:</p>
                  <p className='card__email'>{email}</p>
                </div>
                <div>
                  <p className='card__title'>Number:</p>
                  <p className='card__number'>{number}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Empty</p>
          ))}
      </div>
    </>
  );
}

export default App;
