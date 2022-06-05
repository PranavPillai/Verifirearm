<template>
  <app-header :setStatus="setStatus" />
  <div v-if="connected" class="app-section">
    <div class="credential-form">
      <img src="../assets/images/dmv-logo.svg" alt="dmv" />
      <h1>Congrats on Passing Your Driving Test!</h1>
      <h2>You're ready to be issued your digital driver's license.</h2>      
      <form @submit.prevent="onSubmit">
        <div class="grid-form">
          <div class="form-block">
            <label for="did-number"> DID </label>
            <input
              required
              type="text"
              :disabled="isSubmitting"
              name="did-number"
              v-model="did"
              id="did-number"
              placeholder="e.g (did:vda:...)"
            />
          </div>
          <div class="form-block">
            <label for="health-type"> Eye Color </label>
            <span v-show="validationError" class="error-message"
              >Please choose your eye color !
            </span>
            <div class="dropdown">
              <div class="dropdown-value" @click="toggleSelect">
                <span
                  :class="[
                    eyeColorSelect !== 'Not Selected' &&
                      'dropdown-value-text',
                  ]"
                  >{{ eyeColorSelect }}</span
                >
                <img
                  src="../assets/images/arrow_up.png"
                  alt="mapay"
                  v-if="selectOptions"
                />
                <img src="../assets/images/arrow_down.png" alt="mapay" v-else />
              </div>
              <div v-show="selectOptions" class="dropdown-select">
                <div v-for="(type, index) in eyeColors" :key="index">
                  <span @click="selectType(type)">{{ type }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-block">
            <label for="first-name"> First Name</label>
            <input
              required
              type="text"
              v-model="firstName"
              name="first-name"
              id="first-name"
              :disabled="isSubmitting"
              placeholder="e.g John"
            />
          </div>
          <div class="form-block">
            <label for="last-name"> Last Name</label>
            <input
              required
              type="text"
              v-model="lastName"
              name="last-name"
              :disabled="isSubmitting"
              id="last-name"
              placeholder="e.g Smith"
            />
          </div>
          <div class="form-block">
            <label for="reg-number">Height (in.)</label>
            <input
              required
              type="text"
              v-model="height"
              name="reg-number"
              :disabled="isSubmitting"
              id="reg-number"
              placeholder="e.g 72"
            />
          </div>
          <div class="form-block">
            <label for="reg-exp-date">License expiring date</label>
            <input
              required
              type="date"
              v-model="regExpDate"
              name="reg-exp-date"
              id="reg-exp-date"
              :disabled="isSubmitting"
              placeholder="dd/mm/yy"
            />
          </div>
        </div>
        <div class="submit-btn">
          <button
            :class="['btn-default', isSubmitting && 'loading']"
            type="submit"
            :disabled="isSubmitting"
          >
            Issue Credential
          </button>
        </div>
      </form>
    </div>
  </div>
  <div class="loading-pulse" v-else>
    <pulse-loader :loading="true" color="#000"></pulse-loader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { veridaClient } from "@/helpers";

import AppHeader from "@/components/Header.vue";

const { VUE_APP_DMV_SCHEMA } = process.env;

export default defineComponent({
  name: "Home",
  components: {
    AppHeader,
    PulseLoader,
  },
  data() {
    return {
      connected: veridaClient.connected,
      did: veridaClient.did,
      firstName: "",
      lastName: "",
      height: "",
      regExpDate: "",
      eyeColors: [
        "Blue",
        "Green",
        "Brown",
        "Black"
      ],
      eyeColorSelect: "Not Selected",
      selectOptions: false,
      isSubmitting: false,
      validationError: false,
    };
  },
  methods: {
    async onSubmit() {
      this.validationError = false;
      if (this.eyeColorSelect === "Not Selected") {
        this.validationError = true;
        return;
      }
      this.isSubmitting = true;

      const issueDate = new Date();

      const formValues = {
        name: "Your Digital Driver's License",
        firstName: this.firstName,
        lastName: this.lastName,
        height: this.height,
        eyeColor: this.eyeColorSelect,
        regExpDate: this.regExpDate,
        schema: VUE_APP_DMV_SCHEMA,
        testTimestamp: issueDate.toISOString(),
        summary: "Credential issued at " + issueDate.toDateString(),
      };

      try {
        const credentialData = await veridaClient.createDIDJwt(
          formValues,
          this.did
        );
        await veridaClient.sendMessage(credentialData, this.did);
        this.$toast.success("Credentials Sent Successfully");
      } catch (error) {
        this.$toast.error("Something went wrong  ");
      } finally {
        this.isSubmitting = false;
      }
    },
    toggleSelect() {
      this.selectOptions = !this.selectOptions;
    },
    setStatus(status: boolean) {
      this.connected = status;
      this.did = veridaClient.did as string;
    },

    selectType(value: string) {
      this.eyeColorSelect = value;
      this.selectOptions = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/main.scss";

.input-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  font-family: Nunito Sans;
  color: rgba(4, 17, 51, 0.3);
}

.credential-form {
  @extend .app-container;
  img {
    margin: 2rem 0 1.5rem 0;
  }

  h1 {
    font-weight: bold;
    font-size: 1.8rem;
    line-height: 140%;
    text-align: center;
    color: #041133;
  }
  h2 {
    margin-bottom: 3rem;
  }
}

.loading-pulse {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
}

.dropdown {
  position: relative;
  &-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20.5rem;
    height: 3rem;
    background: #ffffff;
    border: 1px solid #e0e3ea;
    border-radius: 4px;
    @extend .input-text;
    &-text {
      color: #000;
    }
    &:hover {
      border: 1px solid #009fe1;
    }
    & > * {
      padding: 0 0.8rem;
    }
  }
  &-select {
    position: absolute;
    width: 20.5rem;
    background: #ffffff;
    border: 1px solid #009fe1;
    box-sizing: border-box;
    margin: 0.7rem auto;
    border-radius: 4px;
    z-index: 2;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);
    div {
      margin: 1rem auto;
      &:hover {
        background: #f6f7f9;
      }
      span {
        display: block;
        padding: 0.4rem;
      }
    }
  }
}

form {
  display: inline-block;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

.submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto 3rem auto;

  .btn-default {
    height: 3rem;
    padding: 0px 32px;
    outline: none;
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #ffffff;
    border: none;
    background: #2c558b;
    border-radius: 4px;
    &.loading {
      background: #333333;
      opacity: 0.5;
    }
  }
}
.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .form-block {
    text-align: left;
    margin: 0.8rem 1.2rem;
    label {
      display: block;
      margin-bottom: 0.125rem;
    }
    input {
      width: 20.5rem;
      height: 3rem;
      background: #ffffff;
      border: 1px solid #e0e3ea;
      box-sizing: border-box;
      border-radius: 4px;
      outline: none;
      padding: 0 0.8rem;

      &::placeholder {
        @extend .input-text;
      }

      &:hover {
        background: #f8f8f8;
        border: 1px solid #e0e3ea;
        box-sizing: border-box;
        border-radius: 4px;
      }

      &:focus {
        background: #ffffff;
        border: 1px solid #009fe1;
        box-sizing: border-box;
        border-radius: 4px;
      }
    }
  }
}
</style>
