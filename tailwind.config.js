export default {
    safelist:[],
    content: [],
    theme: {
        container:{
            center:true,
        },
        extend: {
            colors:{
                "prime-vue-error":"rgb(220 38 38)",
                primary:"#6F8D80"
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ]
}