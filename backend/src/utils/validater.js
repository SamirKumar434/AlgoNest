//step8--creating validation
const validator=require("validator");
const validate=(data)=>{
    const mandatoryField=['firstName',"emailID",'password'];
    const isAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));
    if(!isAllowed)
        throw new Error("some field missing");
    if(!validator.isEmail(data.emailID))
        throw new Error("invalid email");
    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password");
}
module.exports=validate;