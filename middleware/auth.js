export default defineNuxtRouteMiddleware((to, from) => {
    const {loggedIn} = useUserSession()
    if (!loggedIn.value && to.name == 'index') {
        return navigateTo('/auth')
    }
    if (loggedIn.value && to.name == 'auth'){
        return navigateTo('/')
    }
})