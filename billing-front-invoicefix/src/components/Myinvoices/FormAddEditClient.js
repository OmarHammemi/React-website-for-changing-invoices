import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

function AddEditForm(props) {
  const[form, setValues] = useState({
    id: 0,
    name: '',
    siren: '',
    industry: '',
    description: '',
    logoUrl: '',
    email: ''
  })

  const onChange = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submitFormAdd = e => {
    e.preventDefault()
    fetch('http://localhost:3000/crud', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name,
        siren: form.siren,
        industry: form.industry,
        description: form.description,
        logoUrl: form.logoUrl,
        email: form.email
      })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          props.addItemToState(item[0])
          props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  const submitFormEdit = e => {
    e.preventDefault()
    fetch('http://localhost:3000/crud', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: form.id,
        name: form.name,
        siren: form.siren,
        industry: form.industry,
        description: form.description,
        logoUrl: form.logoUrl,
        email: form.email
      })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          // console.log(item[0])
          props.updateState(item[0])
          props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    if(props.item){
      const { id, name, siren, industry, description, logoUrl, email } = props.item
      setValues({ id, name, siren, industry, description, logoUrl, email })
    }
  }, false)

  return (
    <Form onSubmit={props.item ? submitFormEdit : submitFormAdd}>
      <FormGroup>
        <Label for="name">First Name</Label>
        <Input type="text" name="name" id="name" onChange={onChange} value={form.name === null ? '' : form.name} />
      </FormGroup>
      <FormGroup>
        <Label for="siren">Siren</Label>
        <Input type="text" name="siren" id="siren" onChange={onChange} value={form.siren === null ? '' : form.siren}  />
      </FormGroup>
      <FormGroup>
        <Label for="industry">Industry</Label>
        <Input type="text" name="industry" id="industry" onChange={onChange} value={form.industry === null ? '' : form.industry}  />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <Input type="text" name="description" id="phone" onChange={onChange} value={form.description === null ? '' : form.description}  placeholder="ex. 555-555-5555" />
      </FormGroup>
      <FormGroup>
        <Label for="logoUrl">Logo</Label>
        <Input type="text" name="logoUrl" id="logoUrl" onChange={onChange} value={form.logoUrl === null ? '' : form.logoUrl}  placeholder="City, State" />
      </FormGroup>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input type="text" name="email" id="email" onChange={onChange} value={form.email}  />
      </FormGroup>
      <Button>Submit</Button>
    </Form>
  )
}

export default AddEditForm
