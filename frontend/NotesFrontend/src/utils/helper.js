export const validateEmail=(email)=>{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email)



}

// Validate password strength
export const validatePassword = (password) => {
    // Minimum 6 chars, at least 1 lowercase, 1 uppercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
};


 const getInitials=(name)=>{
    console.log("Inside getInitials")
    if(!name)
        return ""

    const words=name.split(" ")
    let initials= "";

    for(let i=0;i<Math.min(words.length,2);i++)
    {
        initials+=words[i][0];

    }
    return initials.toUpperCase();
} 

export {getInitials}