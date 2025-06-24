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
                primary:"#6562f2"
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ]
}