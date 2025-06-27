<script setup>
const { fetch: refreshSession } = useUserSession();
import { HomeIcon } from '@heroicons/vue/24/solid';
import { useToast } from 'primevue/usetoast';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Gérer les messages directement au lieu d'utiliser onMounted
if (!!route.query.emailsend || !!route.query.verifyaccount) {
  if (route.query.emailsend === 'true') {
    toast.add({
      severity: 'success',
      summary: 'Mail de confirmation envoyé',
      life: 10000,
    });
  } else if (route.query.verifyaccount === 'true') {
    toast.add({
      severity: 'success',
      summary: 'Votre compte a été vérifié',
      life: 5000,
    });
  }
  router.replace({ query: null });
}

const loading = ref(false);

const form = ref({
  email: null,
  password: null,
});

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const onFormSubmit = async function (e) {
  const valid = e.valid;
  if (valid) {
    loading.value = true;
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value,
    })
      .then(async (result) => {
        await refreshSession();
        navigateTo('/');
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: 'Mauvais identifiants',
          life: 3000,
        });
      });
    loading.value = false;
  }
};

const resolver = ({ values }) => {
  const errors = {};

  if (!values.email) {
    errors.email = [{ message: 'Email obligatoire' }];
  } else if (!emailRegex.test(values.email)) {
    errors.email = [{ message: 'Email invalide' }];
  }

  if (!values.password) {
    errors.password = [{ message: 'Mot de passe obligatoire' }];
  }

  return {
    errors,
  };
};

const goToHome = function () {
  navigateTo('/');
};

const toastPt = {
  messageText: '!block',
  messageContent: '!items-center !justify-center',
};

const inputPt = {
  root: 'hover:aria-[invalid=true]:!border-prime-vue-error aria-[invalid=true]:!border-prime-vue-error',
};

const messagePt = {
  text: '!text-xs !font-normal',
};
</script>

<template>
  <div class="h-screen flex gap-6 p-6 bg-primary-100 relative">
    <div class="absolute top-4 left-4">
      <HomeIcon class="size-6 cursor-pointer" @click="goToHome()" />
    </div>
    <div class="flex flex-row w-full h-full justify-center items-center">
      <Toast :pt="toastPt" />
      <div
        class="flex flex-col w-full sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/4 gap-10"
      >
        <Form
          v-slot="$form"
          :initialValues="form"
          :resolver
          :validateOnValueUpdate="false"
          validateOnBlur
          class="bg-white rounded-lg shadow-md flex flex-col justify-center gap-4 p-10"
          @submit="onFormSubmit"
        >
          <h1 class="text-center text-lg font-semibold">Connexion</h1>

          <div class="flex flex-col gap-2">
            <label
              :class="$form.email?.invalid ? 'text-prime-vue-error' : ''"
              for="email"
              >Email</label
            >
            <InputText
              id="email"
              name="email"
              v-model="form.email"
              type="text"
              placeholder="Votre adresse email"
              :pt="inputPt"
            />
            <Message
              v-if="$form.email?.invalid"
              severity="error"
              size="small"
              variant="simple"
              :pt="messagePt"
              >{{ $form.email?.error.message }}</Message
            >
          </div>

          <div class="flex flex-col gap-2">
            <label
              :class="$form.password?.invalid ? 'text-prime-vue-error' : ''"
              for="password"
              >Mot de passe</label
            >
            <Password
              id="password"
              v-model="form.password"
              name="password"
              placeholder="Mot de passe"
              toggleMask
              :feedback="false"
              :pt="inputPt"
              class="w-full"
            />
            <Message
              v-if="$form.password?.invalid"
              severity="error"
              size="small"
              variant="simple"
              :pt="messagePt"
              >{{ $form.password?.error.message }}</Message
            >
          </div>
          <div class="flex flex-col gap-4 mt-4">
            <Button
              type="submit"
              :loading="loading"
              severity="primary"
              label="Se connecter"
              class="w-full"
            />
          </div>
          <p
            class="text-center cursor-pointer text-primary-400 text-sm"
            @click="navigateTo('/auth/register')"
          >
            Créer un compte
          </p>
        </Form>
      </div>
    </div>
  </div>
</template>
