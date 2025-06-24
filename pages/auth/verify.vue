<script setup>
const route = useRoute()
const router = useRouter()

const uuidExist = ref(null)
const toast = useToast();

const checkUuid = function (){
  $fetch('/api/auth/check-uuid',{
    method:"POST",
    body:{
      uuid:route.query.uuid || null
    }
  }).then((result) => {
    uuidExist.value = result.ok
  }).catch((data) => {
    uuidExist.value = false
  })
}

const verifyAccount = async function(){
  $fetch('/api/auth/verify-account',{
    method:"POST",
    body:{
      uuid:route.query.uuid
    }
  }).then((result) => {
    navigateTo("/auth?verifyaccount=true")
  })
}

const toastPt = {
  messageText: "!block",
  messageContent: "!items-center !justify-center",
};

checkUuid()
</script>
<template>
  <div class="h-screen flex gap-6 p-6 bg-slate-50">
    <div class="flex flex-row w-full h-full justify-center items-center">
      <Toast :pt="toastPt" />
      <div v-if="uuidExist != null && uuidExist" class="flex flex-col w-full sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/4 gap-10 ">
        <Button @click="verifyAccount()" label="Vérifier mon compte" />
      </div>
      <div v-else>
        Mauvais lien
      </div>
    </div>
  </div>
</template>