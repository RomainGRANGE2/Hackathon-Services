<script setup>
const { fetch: refreshSession } = useUserSession();

const toast = useToast();
const loading = ref(false);

const form = ref({
  firstname: null,
  lastname: null,
  role: false,
  description: null,
  phone: null,
  location: null,
  email: null,
  password: null,
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const onFormSubmit = async function (e) {
  const valid = e.valid;
  if (valid) {
    loading.value = true;
    await $fetch("/api/auth/register", {
      method: "POST",
      body: form.value,
    }).then(async (result) => {
       navigateTo("/auth");
    }).catch((error) => {
      toast.add({
        severity: "error",
        summary: "Erreur lors de l'inscription",
        life: 3000,
      });
    });
    loading.value = false;
  }
};

const resolver = ({ values }) => {
  const errors = {};
  if (!values.email) {
    errors.email = [{ message: "Email obligatoire" }];
  } else if (!emailRegex.test(values.email)) {
    errors.email = [{ message: "Email invalide" }];
  }

  if (!values.password) {
    errors.password = [{ message: "Mot de passe obligatoire" }];
  }

  if (!values.firstname) {
    errors.firstname = [{ message: "Prénom obligatoire" }];
  }

  if (!values.lastname) {
    errors.lastname = [{ message: "Nom obligatoire" }];
  }

  return { errors };
};

const toastPt = {
  messageText: "!block",
  messageContent: "!items-center !justify-center",
};

const inputPt = {
  root: "hover:aria-[invalid=true]:!border-prime-vue-error aria-[invalid=true]:!border-prime-vue-error",
};

const messagePt = {
  text: "!text-xs !font-normal",
};
</script>


<template>
  <div class="h-screen flex gap-6 p-6 bg-slate-50">
    <div class="flex flex-row w-full h-full justify-center items-center">
      <Toast :pt="toastPt" />
      <div class="flex flex-col w-full sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/4 gap-10 ">
        <Form
            v-slot="$form"
            :initialValues="form"
            :resolver="resolver"
            :validateOnValueUpdate="false"
            validateOnBlur
            class="bg-white rounded-lg shadow-md flex flex-col justify-center gap-4 p-10"
            @submit="onFormSubmit"
        >
          <h1 class="text-center text-lg font-semibold">Créer un compte</h1>

          <div class="flex flex-col gap-2">
            <label :class="$form.firstname?.invalid ? 'text-prime-vue-error' : ''" for="email">Prénom</label>
            <InputText
                id="firstname"
                v-model="form.firstname"
                name="firstname"
                type="text"
                placeholder="Votre prénom"
                :pt="inputPt"
            />
            <Message v-if="$form.firstname?.invalid" severity="error" size="small" variant="simple" :pt="messagePt">
              {{ $form.firstname?.error.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-2">
            <label :class="$form.lastname?.invalid ? 'text-prime-vue-error' : ''" for="email">Nom</label>
            <InputText
                id="lastname"
                v-model="form.lastname"
                name="lastname"
                type="text"
                placeholder="Votre nom"
                :pt="inputPt"
            />
            <Message v-if="$form.lastname?.invalid" severity="error" size="small" variant="simple" :pt="messagePt">
              {{ $form.lastname?.error.message }}
            </Message>
          </div>

          <div class="flex items-center gap-x-2">
            <span class="text-xs">Client</span>
            <ToggleSwitch v-model="form.role" />
            <span class="text-xs">Prestataire</span>
          </div>

          <div v-if="form.role" class="flex flex-col gap-2">
            <label for="description">Description</label>
            <InputText
                id="description"
                v-model="form.description"
                name="description"
                type="text"
                placeholder="Décrivez votre activité"
                :pt="inputPt"
            />
            <label for="phone">Téléphone</label>
            <InputText
                id="phone"
                v-model="form.phone"
                name="phone"
                type="text"
                placeholder="Numéro de téléphone"
                :pt="inputPt"
            />
            <label for="location">Localisation</label>
            <InputText
                id="location"
                v-model="form.location"
                name="location"
                type="text"
                placeholder="Où êtes-vous basé ?"
                :pt="inputPt"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label :class="$form.email?.invalid ? 'text-prime-vue-error' : ''" for="email">Email</label>
            <InputText
                id="email"
                v-model="form.email"
                name="email"
                type="text"
                placeholder="Votre adresse email"
                :pt="inputPt"
            />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple" :pt="messagePt">
              {{ $form.email?.error.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-2">
            <label :class="$form.password?.invalid ? 'text-prime-vue-error' : ''" for="password">Mot de passe</label>
            <InputText
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                :pt="inputPt"
            />
            <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple" :pt="messagePt">
              {{ $form.password?.error.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-4 mt-4">
            <Button
                type="submit"
                :loading="loading"
                severity="primary"
                label="Créer mon compte"
                class="w-full"
            />
          </div>
          <p class="text-center cursor-pointer text-primary text-sm" @click="navigateTo('/auth')">Se connecter</p>
        </Form>
      </div>
    </div>
  </div>
</template>
