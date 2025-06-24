export const brevo = () => {

    const urlBase = "https://api.brevo.com/v3"
    const apiKey = process.env.BREVO_API

    const defaultSenderEmail = "services@romaingrange.fr"
    const defaultSenderName = "Services (fiver like)"


    const headers = {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json',
        'api-key': apiKey
    }

    const sendTransactionnalTemplate = (emailData) => {

        const url = `${urlBase}/smtp/email`
        const body = JSON.stringify({
            ...emailData,
            sender: {
                name:defaultSenderName,
                email:defaultSenderEmail
            }
        })

        return fetch(url, {
            method: 'POST',
            body: body,
            headers: headers
        }).then(async(res) => {
            return await res.json()
        }).then((jsonRes) => {
            return jsonRes.status === 201
        })
    }

    const email = {
        email: '',
        name: null
    }

    const data = {
        sender: email,
        bcc: null,
        templateId: null,
        params: {}
    }

    const emailFactory = (email, name) => {
        return {
            email: email,
            name: name
        }
    }

    const payloadFactory = (tos, templateId,subject, params) => {

        return {
            ...data,
            sender: emailFactory(defaultSenderEmail, defaultSenderName),
            bcc: tos,
            subject:subject,
            templateId: templateId,
            params: params
        }
    }

    return {
        emailFactory,
        payloadFactory,
        sendTransactionnalTemplate
    }
}