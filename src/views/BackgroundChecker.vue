<template>
  <app-header :setStatus="setStatus" />
  <div v-if="connected" class="app-section">
    <div class="credential-form">
      <img class="logo" src="../assets/images/justice-dept-logo.jpeg" alt="verida" />
      <h1>To Purchase a Firearm, Complete the CA Universal Background Check</h1>
      <h2>The California DOJ Bureau of Firearms accepts verified credentials to prove identity, mental wellness, and criminal records.</h2>
      <form @submit.prevent="onSubmitDMV">
        <div class="submit-btn">
          <button
            :class="['btn-default', (dmvSubmitting || dmvSubmitted) && 'loading', dmvSubmitted && 'done']"
            type="submit"
            :disabled="dmvSubmitting || dmvSubmitted"
          >
            Submit Driver's License
          </button>
        </div>
      </form>
      <form @submit.prevent="onSubmitHealth">
        <div class="submit-btn">
          <button
            :class="['btn-default', (healthSubmitting || healthSubmitted) && 'loading', healthSubmitted && 'done']"
            type="submit"
            :disabled="healthSubmitted || healthSubmitting"
          >
            Submit Mental Health Screening
          </button>
        </div>
      </form>
      <form @submit.prevent="onSubmitCrime">
        <div class="submit-btn">
          <button
            :class="['btn-default', (crimeSubmitting || crimeSubmitted) && 'loading', crimeSubmitted && 'done']"
            type="submit"
            :disabled="crimeSubmitted || crimeSubmitting"
          >
            Submit Criminal Background Check
          </button>
        </div>
      </form>
      <form @submit.prevent="onVerify">
        <div class="submit-btn">
          <button
            :class="['btn-default', (isSubmitting || (!crimeSubmitted) || (!dmvSubmitted) || (!healthSubmitted)) && 'loading']"
            type="submit"
            :disabled="isSubmitting || (!crimeSubmitted) || (!dmvSubmitted) || (!healthSubmitted)"
          >
            Verify Credentials and Submit Background Check
          </button>
        </div>
      </form>
    </div>
  </div>
  <div class="loading-pulse" v-else>
    <pulse-loader :loading="true" color="#000"></pulse-loader>
  </div>
  <div class="modal-container" v-if="validatingMessage">
    <div class="modal">
      <rotate-loader />
      <p>{{validatingMessage}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import RotateLoader from "vue-spinner/src/RotateLoader.vue";
import { veridaClient } from "@/helpers";

import AppHeader from "@/components/Header.vue";

const { VUE_APP_DMV_SCHEMA, VUE_APP_HEALTH_SCHEMA, VUE_APP_CRIME_SCHEMA  } = process.env;

export default defineComponent({
  name: "Home",
  components: {
    AppHeader,
    PulseLoader,
    RotateLoader
  },
  data() {
    return {
      connected: veridaClient.connected,
      did: veridaClient.did,
      selectOptions: false,
      isSubmitting: false,
      validationError: false,
      dmvSubmitting: false,
      healthSubmitting: false,
      crimeSubmitting: false,
      dmvSubmitted: false,
      healthSubmitted: false,
      crimeSubmitted: false,
      validCreds: false,
      validatingMessage: ""
    };
  },
  methods: {
    async onSubmitDMV() {
      this.validationError = false;
      this.dmvSubmitting = true;
      try {
        await veridaClient.requestVC(
          this.did,
          VUE_APP_DMV_SCHEMA
        );
        this.dmvSubmitted = true;
        this.$toast.success("Driver's License Requested Successfully");
      } catch (error) {
        this.$toast.error("Something went wrong  ");
      } finally {
        this.dmvSubmitting = false;
      }
    },
    async onSubmitHealth() {
      this.validationError = false;
      this.healthSubmitting = true;
      try {
        await veridaClient.requestVC(
          this.did,
          VUE_APP_HEALTH_SCHEMA
        );
        this.healthSubmitted = true;
        this.$toast.success("Mental Health Screen Requested Successfully");
      } catch (error) {
        this.$toast.error("Something went wrong  ");
      } finally {
        this.healthSubmitting = false;
      }
    },
    async onSubmitCrime() {
      this.validationError = false;
      this.crimeSubmitting = true;
      try {
        await veridaClient.requestVC(
          this.did,
          VUE_APP_CRIME_SCHEMA
        );
        this.$toast.success("Criminal Background Check Requested Successfully");
        this.crimeSubmitted = true;
      } catch (error) {
        this.$toast.success("Something went wrong  ");
      } finally {
        this.crimeSubmitting = false;
      }
    },
    async onVerify() {
      this.isSubmitting = true;
      this.validatingMessage = "Validating your credentials and performing background check...";
      if (this.dmvSubmitted == true && this.healthSubmitted == true && this.crimeSubmitted) {
        setTimeout(() => {
          this.validCreds = true;
          this.$toast.success("You've cleared your background check.");
          this.isSubmitting = false;
          this.validatingMessage = "";
        }, 5000);
      } else {
        this.$toast.error("Something went wrong  ");
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
    margin-bottom: 1rem;
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

.logo {
  height: 15rem;
  width: 15rem;
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

.center-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn {
  margin: 1rem auto 3rem auto;
  justify-content: flex-start;
  align-items: flex-start;
  &:hover {
    cursor: pointer !important;
    background: #333333;
    opacity: 0.5;
    .loading {
      cursor: pointer !important;
      color: white;
      opacity: 1.0;
    }
  }

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
    &.done {
      text-decoration: line-through;
    }
  }
}

.modal-container {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
}

.modal {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  height: 25rem;
  width: 25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3rem;
  p {
    margin-top: 2rem;
    font-family: Nunito Sans;
    font-size: 1.2rem;
    font-weight: bold;
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
