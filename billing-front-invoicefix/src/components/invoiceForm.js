import React from 'react';
import { useFormState } from 'react-use-form-state';
import { Container, FormTitle, MainTitle, Button } from '../styled/styledForm';

function Invoice({ onSubmit }) {

  const [invoiceForm, {text, number}] = useFormState();

  function handleSubmit(e){
    console.log('Something')
  }

  function calculTotal({ up,  qty, disc}){
   
  }

  return(
    <Container >
    <header>
      <MainTitle> Invoice Form </MainTitle>
    </header>

      <form onSubmit={handleSubmit}>
        <FormTitle>Billing Details: </FormTitle>

          <label>Company Name</label>
          <input {...text('company')} placeholder="Company Name" required/>
          <input {...text('billTo')} placeholder="Company Address" required />
          <label>Your info</label>
          <input {...text('yourName')} placeholder="Your Name" required />
          <input {...text('billFrom')} placeholder=" Your Billing Address" required />

          <FormTitle>Invoice Details: </FormTitle>
          <label>Invoice #</label>
          <input {...text('invoiceNum')} placeholder="Item Number"  required />
          <label>Description</label>
          <input {...text('desc')} placeholder="Description"  required />
          <label>Qty</label>
          <input {...number('qty')} placeholder="Quantity"  required />
          <label>Unit Price</label>
          <input {...number('up')} placeholder="Unit Price"  required />
          <label>Discount</label>
          <input {...text('disc')} placeholder="Discount"  required />
        <Button>Submit</Button>
    </form>
    </ Container>
  )
}


export default Invoice;




