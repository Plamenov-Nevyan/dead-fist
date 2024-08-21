const invalidCharsRegex = /[^a-zA-Z0-9]/i;
const invalidCharsRegexEmail = /[^a-zA-Z0-9._%+-@]/
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const CheckInputErrors = (inputs, action) => {
    console.log(inputs)
    const errors = inspectInput(inputs, action)
    console.log(errors)
    return errors
}

const inspectInput = (inputs, action) => {
    const errors = {
        username: [],
        email: [],
        password: [],
        c_password: []
    }
   Object.entries(inputs).forEach(([key, value]) => {
    console.log(key)
    console.log(value)
        if(key === 'username'){
            if(value === ''){
                errors.username.push('Username is required!')
            }else if(invalidCharsRegex.test(value)){
                errors.username.push('Username should contain only letters and numbers!')
            }else if(value.length < 5){
                errors.username.push('Username should be atleast 5 characters long!')
            }else if(value.length > 20){
                errors.username.push('Username can\'t be longer than 20 characters!')
            }
        }else if(key === 'email'){
            if(value === ''){
                errors.email.push('Email is required!')
            }else if(!emailRegex.test(value)){
                errors.email.push('Email is invalid!')
            }else if(invalidCharsRegexEmail.test(value)){
                errors.email.push('Email should contain only letters and numbers!')
            }else if(value.length < 8){
                errors.email.push('Email should be atleast 8 characters long!')
            }else if(value.length > 30){
                errors.email.push('Email can\'t be longer than 30 characters!')
            }
        }else if(key === 'password'){
            if(value === ''){
                 errors.password.push('Password is required!')
            }else if(action === 'register' && inputs['c_password'] === ''){
                errors.c_password.push('Please confirm your password!')
            }else if(value.length < 6){
                errors.password.push('Password should be atleast 6 characters long!')
            }else if(action === 'register' && inputs['password'] !== inputs['c_password']){
                errors.password.push('Please confirm your password correctly.')
            }
        }
   })
    return errors
}