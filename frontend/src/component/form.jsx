// src/components/DoubtsForm.js
import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import "./DoubtsForm.css";

const endpoint = "localhost:3000/api/doubts";

const GeminiAPIKey = "AIzaSyCsuZn39V72kEmGx6494MHe5HFCG7gp-do";
const GeminiAPIURL = "https://api.gemini.com/v1/doubts";

const DoubtsForm = () => {
  const initialValues = {
    name: "",
    email: "",
    doubts: [""],
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.doubts || values.doubts.length === 0) {
      errors.doubts = "At least one doubt is required";
    } else {
      const doubtsArrayErrors = [];
      values.doubts.forEach((doubt, index) => {
        if (!doubt) {
          doubtsArrayErrors[index] = "Doubt is required";
        }
      });
      if (doubtsArrayErrors.length) {
        errors.doubts = doubtsArrayErrors;
      }
    }

    return errors;
  };

  const onSubmit = async (values) => {
    try {
      // Send doubts to Gemini API
      const responses = await Promise.all(
        values.doubts.map((doubt) =>
          fetch(`${GeminiAPIURL}?key=${GeminiAPIKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ doubt }),
          }).then((res) => res.json())
        )
      );

      // Format responses
      const responseTexts = responses
        .map((response) => response.result || "No answer found")
        .join("\n\n");

      // Send email with responses
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: values.email,
          subject: "Your Academic Doubts",
          body: `Dear ${values.name},\n\nHere are the answers to your doubts:\n\n${responseTexts}\n\nBest regards,\nYour Team`,
        }),
      });

      alert("Form submitted successfully and email sent!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched }) => (
        <Form>
          <div>
            <label htmlFor="name">Name</label>
            <Field type="text" id="name" name="name" />
            {errors.name && touched.name && (
              <div className="error">{errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
            {errors.email && touched.email && (
              <div className="error">{errors.email}</div>
            )}
          </div>
          <FieldArray name="doubts">
            {({ push, remove }) => (
              <div>
                {values.doubts.map((doubt, index) => (
                  <div key={index}>
                    <label htmlFor={`doubts.${index}`}>Doubt {index + 1}</label>
                    <Field
                      type="text"
                      id={`doubts.${index}`}
                      name={`doubts.${index}`}
                    />
                    {errors.doubts &&
                      errors.doubts[index] &&
                      touched.doubts &&
                      touched.doubts[index] && (
                        <div className="error">{errors.doubts[index]}</div>
                      )}
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push("")}
                  disabled={values.doubts.length >= 5}
                >
                  Add Doubt
                </button>
              </div>
            )}
          </FieldArray>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default DoubtsForm;
