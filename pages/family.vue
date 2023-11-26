<template>
  <div>
    <v-card class="bg-grey-darken-3 h-100">
      <v-card-title>ครอบครัว</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" lg="2">
            <v-select
              v-model="currentFamily"
              return-object
              :items="families"
              no-data-text="ไม่พบข้อมูลครอบครัว"
              item-title="name"
              item-value="id"
              variant="outlined"
              label="ครอบครัว"
              @update:modelValue="fetchMember"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" lg="4" class="px-0">
            <v-row>
              <v-dialog v-model="dialogState" width="500">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="#7E57C2" class="mt-4 ml-3"
                      >จัดการครอบครัว</v-btn
                    >
                  </template>
                  <v-card>
                    <v-toolbar
                      color="#7E57C2"
                      title="จัดการข้อมูลครอบครัว"
                    ></v-toolbar>
                    <v-card-text>
                      <v-form @submit="createFamily">
                        <v-row>
                          <v-col cols="9"
                            ><v-text-field
                              v-bind="newFamilyName"
                              variant="outlined"
                              label="ชื่อครอบครัว"
                          /></v-col>
                          <v-col cols="3"
                            ><v-btn color="#7E57C2" type="submit" class="mt-2"
                              >เพิ่มครอบครัว</v-btn
                            ></v-col
                          >
                        </v-row>
                      </v-form>
                      <v-data-table
                        :headers="familyTableHeaders"
                        :items="families"
                      >
                        <template #[`item.action`]="{ item }">
                          <v-row>
                            <v-btn
                              icon="mdi-close"
                              color="#7E57C2"
                              size="x-small"
                              @click="removeMember(item.id, currentUser.id)"
                            />
                            <v-btn
                              icon="mdi-trash-can"
                              color="#7E57C2"
                              size="x-small"
                              class="ml-1"
                              @click="deleteFamily(item.id)"
                            />
                          </v-row>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card> </v-dialog
              >
              <v-dialog v-model="newMemberDialogState" width="500">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="#7E57C2" class="mt-4 ml-3"
                      >เพิ่มสมาชิก</v-btn
                    >
                  </template>
                  <v-card>
                    <v-toolbar
                      color="#7E57C2"
                      title="เพิ่มสมาชิกในครอบครัว"
                    ></v-toolbar>
                    <v-card-text>
                      <v-form @submit="createFamilyMember">
                        <v-row>
                          <v-col cols="9"
                            ><v-text-field
                              v-bind="newMemberUsername"
                              variant="outlined"
                              label="ค้นหาด้วย username"
                          /></v-col>
                          <v-col cols="3"
                            ><v-btn color="#7E57C2" type="submit" class="mt-2"
                              >เพิ่มครอบครัว</v-btn
                            ></v-col
                          >
                        </v-row>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
            </v-row>
          </v-col>
        </v-row>
        <v-data-table
          :loading="tableLoaded"
          :headers="tableHeaders"
          :items="tableData"
        >
          <template #[`item.action`]="{ item }">
            <v-row>
              <v-btn
                @click="removeMember(item.id, currentFamily?.id!)"
                icon="mdi-trash-can"
                color="#7E57C2"
                size="x-small"
              ></v-btn>
            </v-row>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { type Member, type Family } from "../types/family.model";
const tableHeaders = [
  { title: "ชื่อ", value: "name", width: "45%" },
  { title: "username", value: "username", width: "45%" },
  { value: "action", width: "10%" },
];

const tableData: Ref<Member[]> = ref([]);

const currentUser = useUser().value;

const tableLoaded = ref(true);

const families: Ref<Family[]> = ref([]);

const currentFamily: Ref<Family> | Ref<undefined> = ref();

const fetchFamily = async () => {
  const { data: response } = await useFetch<{ result: Family[] }>(
    "http://localhost:8000/families/getUserFamily",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  families.value = response.value?.result!;
};

const fetchMember = async () => {
  const { data: response } = await useFetch<{ result: Member[] }>(
    "http://localhost:8000/families/getFamilyMember",
    {
      method: "POST",
      body: {
        familyId: currentFamily.value?.id,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  tableData.value = response.value?.result!;
};

onMounted(async () => {
  await fetchFamily();
  if (families.value.length > 0) {
    currentFamily.value = families.value[0];
    await fetchMember();
  }
  tableLoaded.value = false;
});
const dialogState = ref(false);

const familyTableHeaders = [
  { title: "ชื่อ", value: "name", width: "80%" },
  { value: "action", width: "20%" },
];

const schema = yup.object({
  newFamilyName: yup.string().required(),
});

const { defineComponentBinds, handleSubmit } = useForm({
  validationSchema: schema,
});

const vuetifyConfig = (state: any) => ({
  props: {
    "error-messages": state.errors,
  },
});

const newFamilyName = defineComponentBinds("newFamilyName", vuetifyConfig);

const createFamily = handleSubmit(async (values) => {
  dialogState.value = false;
  const { isConfirmed } = await Swal.fire({
    icon: "question",
    html: '<p class="text-white">ยืนยันการเพิ่มครอบครัวใช่หรือไม่</p>',
    background: "#424242",
    iconColor: "#7E57C2",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });

  if (isConfirmed) {
    const { error } = useFetch("http://localhost:8000/families/createFamily", {
      method: "POST",
      body: {
        name: values.newFamilyName,
        userId: currentUser.id,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await Swal.fire({
      icon: "success",
      html: '<p class="text-white">เพิ่มครอบครัวเรียบร้อย</p>',
      background: "#424242",
      iconColor: "#7E57C2",
      showConfirmButton: false,
    });
    await fetchFamily();
    await fetchMember();
    return;
  }

  dialogState.value = true;
});

const removeMember = async (userId: number, familyId: number) => {
  dialogState.value = false;
  const { isConfirmed } = await Swal.fire({
    icon: "question",
    html: '<p class="text-white">ยืนยันการออกจากครอบครัวใช่หรือไม่</p>',
    background: "#424242",
    iconColor: "#7E57C2",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });

  if (isConfirmed) {
    const { error } = useFetch("http://localhost:8000/families/removeMember", {
      method: "POST",
      body: {
        userId,
        familyId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await Swal.fire({
      icon: "success",
      html: '<p class="text-white">ออกจากครอบครัวเรียบร้อย</p>',
      background: "#424242",
      iconColor: "#7E57C2",
      showConfirmButton: false,
    });
    await fetchFamily();
    await fetchMember();
    return;
  }
};
const deleteFamily = async (familyId: number) => {
  dialogState.value = false;
  const { isConfirmed } = await Swal.fire({
    icon: "question",
    html: '<p class="text-white">ยืนยันการลบครอบครัวใช่หรือไม่</p>',
    background: "#424242",
    iconColor: "#7E57C2",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });

  if (isConfirmed) {
    const { error } = useFetch("http://localhost:8000/families/deleteFamily", {
      method: "POST",
      body: {
        familyId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await Swal.fire({
      icon: "success",
      html: '<p class="text-white">ออกจากครอบครัวเรียบร้อย</p>',
      background: "#424242",
      iconColor: "#7E57C2",
      showConfirmButton: false,
    });
    await fetchFamily();
    await fetchMember();
    return;
  }
};

const newMemberDialogState = ref(false);

const newMemberSchema = yup.object({
  username: yup.string().required(),
});

const {
  defineComponentBinds: newUserComponentBinds,
  handleSubmit: handleSecondFormSubmit,
} = useForm({
  validationSchema: newMemberSchema,
});

const newMemberUsername = newUserComponentBinds("username", vuetifyConfig);

const createFamilyMember = handleSecondFormSubmit(async (values) => {
  newMemberDialogState.value = false;
  const { isConfirmed } = await Swal.fire({
    icon: "question",
    html: '<p class="text-white">ยืนยันการเพิ่มสมาชิกครอบครัวใช่หรือไม่</p>',
    background: "#424242",
    iconColor: "#7E57C2",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });

  if (isConfirmed) {
    const { error } = useFetch("http://localhost:8000/families/addMember", {
      method: "POST",
      body: {
        familyId: currentFamily.value?.id,
        username: values.username,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    await Swal.fire({
      icon: "success",
      html: '<p class="text-white">เพิ่มครอบครัวเรียบร้อย</p>',
      background: "#424242",
      iconColor: "#7E57C2",
      showConfirmButton: false,
    });
    await fetchFamily();
    await fetchMember();
    return;
  }
});
</script>