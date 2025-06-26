<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

definePageMeta({
  middleware: ["auth"],
  layout: "navbar",
});

const toast = useToast();
const reservations = ref([]);
const loading = ref(true);
const updating = ref(false);

const statusLabels = {
  pending: "En attente",
  accepted: "Acceptée",
  rejected: "Refusée",
};

const statusSeverities = {
  pending: "warn",
  accepted: "success",
  rejected: "danger",
};

onMounted(async () => {
  await loadReservations();
});

const loadReservations = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/reservations/my-received");

    if (response.success) {
      reservations.value = response.reservations;
    } else {
      toast.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de récupérer les réservations",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erreur lors du chargement des réservations:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Une erreur s'est produite lors du chargement des réservations",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const updateReservationStatus = async (reservationId, status) => {
  try {
    updating.value = true;
    const response = await $fetch("/api/reservations/update-status", {
      method: "PUT",
      body: {
        reservationId,
        status,
      },
    });

    if (response.success) {
      toast.add({
        severity: "success",
        summary: "Succès",
        detail: response.message,
        life: 3000,
      });

      // Mettre à jour la réservation dans la liste
      const index = reservations.value.findIndex((r) => r.id === reservationId);
      if (index !== -1) {
        reservations.value[index].status = status;
      }
    } else {
      toast.add({
        severity: "error",
        summary: "Erreur",
        detail: response.message || "Erreur lors de la mise à jour",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Une erreur s'est produite lors de la mise à jour",
      life: 3000,
    });
  } finally {
    updating.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="container mx-auto p-4">
    <Toast />

    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-2">Mon compte</h1>
      <p class="text-gray-600">Gérez vos réservations reçues</p>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else>
      <div v-if="reservations.length === 0" class="text-center py-8">
        <div class="bg-gray-50 rounded-lg p-8">
          <i class="pi pi-calendar text-6xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            Aucune réservation reçue
          </h3>
          <p class="text-gray-500">
            Les demandes de réservation pour vos services apparaîtront ici.
          </p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="reservation in reservations"
          :key="reservation.id"
          class="bg-white rounded-lg shadow-md border p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold mb-2">
                {{ reservation.service_title }}
              </h3>
              <div class="flex items-center gap-2 mb-2">
                <Tag
                  :value="statusLabels[reservation.status]"
                  :severity="statusSeverities[reservation.status]"
                />
                <span class="text-sm text-gray-500">
                  {{ formatDate(reservation.created_at) }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 mb-1">
                {{ reservation.service_price }} €
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 class="font-semibold text-gray-700 mb-2">
                  <i class="pi pi-user mr-2"></i>
                  Informations client
                </h4>
                <div class="space-y-1 text-sm">
                  <p>
                    <span class="font-medium">Nom :</span>
                    {{ reservation.customer_firstname }}
                    {{ reservation.customer_lastname }}
                  </p>
                  <p>
                    <span class="font-medium">Email :</span>
                    <a
                      :href="`mailto:${reservation.customer_email}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ reservation.customer_email }}
                    </a>
                  </p>
                  <p v-if="reservation.customer_phone">
                    <span class="font-medium">Téléphone :</span>
                    <a
                      :href="`tel:${reservation.customer_phone}`"
                      class="text-blue-600 hover:underline"
                    >
                      {{ reservation.customer_phone }}
                    </a>
                  </p>
                </div>
              </div>

              <div v-if="reservation.message">
                <h4 class="font-semibold text-gray-700 mb-2">
                  <i class="pi pi-comment mr-2"></i>
                  Message du client
                </h4>
                <div class="bg-gray-50 p-3 rounded-lg text-sm">
                  {{ reservation.message }}
                </div>
              </div>
            </div>

            <div
              v-if="reservation.status === 'pending'"
              class="flex gap-3 pt-4 border-t"
            >
              <Button
                label="Accepter"
                icon="pi pi-check"
                class="p-button-success"
                @click="updateReservationStatus(reservation.id, 'accepted')"
                :loading="updating"
              />
              <Button
                label="Refuser"
                icon="pi pi-times"
                class="p-button-danger p-button-outlined"
                @click="updateReservationStatus(reservation.id, 'rejected')"
                :loading="updating"
              />
            </div>

            <div
              v-else-if="reservation.status === 'accepted'"
              class="pt-4 border-t"
            >
              <div class="flex items-center gap-2 text-green-600">
                <i class="pi pi-check-circle"></i>
                <span class="font-medium">Réservation acceptée</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                Vous pouvez maintenant contacter le client pour organiser la
                prestation.
              </p>
            </div>

            <div
              v-else-if="reservation.status === 'rejected'"
              class="pt-4 border-t"
            >
              <div class="flex items-center gap-2 text-red-600">
                <i class="pi pi-times-circle"></i>
                <span class="font-medium">Réservation refusée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
