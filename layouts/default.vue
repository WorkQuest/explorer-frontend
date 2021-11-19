<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__content">
        <div
          v-if="isMobileMenu"
          class="template__screen"
          @click="closeMenu()"
        />
        <div
          v-click-outside="closeAll"
          class="template__header header"
        >
          <div class="header__body">
            <div class="header__left">
              <div
                class="header__logo"
                @click="toMain()"
              >
                <img
                  src="~assets/img/app/logo.svg"
                  alt="WorkQuest"
                >
                <span class="header__text">WorkQuest</span>
              </div>
              <div class="header__links">
                <nuxt-link
                  to="/home"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.home') }}
                </nuxt-link>
                <nuxt-link
                  to="/blocks"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.blocks') }}
                </nuxt-link>
                <nuxt-link
                  to="/transactions"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.txs') }}
                </nuxt-link>
                <p class="header__separator" />
                <nuxt-link
                  to="/transfers"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.transfers') }}
                </nuxt-link>
                <nuxt-link
                  to="/tokens"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.tokens') }}
                </nuxt-link>
              </div>
            </div>
            <div
              class="header__logo_mobile"
              @click="toMain()"
            >
              <img
                src="~assets/img/app/logo.svg"
                alt="WorkQuest"
              >
            </div>
            <div class="header__right">
              <button
                class="header__button header__button_locale"
                @click="showLocale()"
              >
                {{ currentLocale.toUpperCase() }}
                <span class="icon-caret_down" />
                <transition name="fade">
                  <div
                    v-if="isShowLocale"
                    class="locale"
                  >
                    <div
                      v-for="(item, i) in locales"
                      :key="i"
                      class="locale__container"
                    >
                      <div
                        class="locale__items"
                        @click="setLocale(item)"
                      >
                        <img
                          :src="`/img/app/${item}.svg`"
                          :alt="item"
                          class="locale__icon"
                        >
                        <div class="locale__text">
                          {{ item.toUpperCase() }}
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </button>
              <div
                class="ctm-menu__toggle"
                @click="openMenu()"
              >
                <button
                  class="header__button header__button_menu"
                >
                  <span
                    class="icon-hamburger"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- mobile header -->
        <div
          v-click-outside="closeAll"
          class="template__header header_mobile"
        >
          <div
            v-if="isMobileMenu"
            class="header__left_mobile"
          >
            <div
              class="header__logo"
              @click="closeMenuByLink()"
            >
              <img
                src="~assets/img/app/logo.svg"
                alt="WorkQuest"
              >
              <span class="header__text">WorkQuest</span>
            </div>
            <div class="header__links">
              <span @click="closeMenu()">
                <nuxt-link
                  to="/home"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.home') }}
                </nuxt-link>
              </span>
              <span @click="closeMenu()">
                <nuxt-link
                  to="/blocks"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.blocks') }}
                </nuxt-link>
              </span>
              <span @click="closeMenu()">
                <nuxt-link
                  to="/transactions"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.txs') }}
                </nuxt-link>
              </span>
              <p class="header__separator" />
              <span @click="closeMenu()">
                <nuxt-link
                  to="/transfers"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.transfers') }}
                </nuxt-link>
              </span>
              <span @click="closeMenu()">
                <nuxt-link
                  to="/tokens"
                  class="header__link"
                  :active-class="'header__link_active'"
                >
                  {{ $t('ui.tokens') }}
                </nuxt-link>
              </span>
            </div>
          </div>
        </div>
        <div class="template__content">
          <nuxt />
        </div>
        <div
          v-if="isMobileMenu"
          class="template__footer footer"
        >
          <div class="footer__left">
            <p class="footer__copy">
              © Workquest 2021
            </p>
            <p class="footer__copy">
              {{ $t('ui.rights') }}
            </p>
          </div>
          <div class="footer__right">
            <nuxt-link
              to="/"
              class="footer__link"
            >
              · {{ $t('ui.terms') }}
            </nuxt-link>
            <nuxt-link
              to="/"
              class="footer__link"
            >
              · {{ $t('ui.privacy') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <loader v-if="isLoading" />
    </transition>

    <ctm-modal />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'DefaultLayout',
  components: {},
  directives: {
    ClickOutside,
  },
  data() {
    return {
      isInstrumentDropdownOpened: false,
      isUserDDOpened: false,
      isShowProfile: false,
      isShowNotify: false,
      isShowAdditionalMenu: false,
      isShowLocale: false,
      isMobileMenu: false,
      isNotFlexContainer: true,
      currentLocale: '',
      locales: [],
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
    }),
  },
  mounted() {
    this.currentLocale = this.$i18n.locale;
    this.locales = this.$i18n.locales;
    moment.locale(this.currentLocale);
  },
  methods: {
    toRoute(path) {
      this.$router.push(path);
      this.toggleMobileMenu();
    },
    toggleMobileMenu() {
      this.isMobileMenu = !this.isMobileMenu;
      this.isNotFlexContainer = !this.isNotFlexContainer;
      this.closeAnother('mobile');
    },
    openMenu() {
      this.isMobileMenu = true;
    },
    closeMenu() {
      this.isMobileMenu = false;
    },
    toMain() {
      this.$router.push('/');
    },
    closeMenuByLink() {
      this.toMain();
      this.closeMenu();
    },
    goToMessages() {
      this.$router.push('/messages');
      this.closeAll();
    },
    showProfile() {
      this.closeAnother('profile');
      this.isShowProfile = !this.isShowProfile;
    },
    showNotification() {
      this.closeAnother('notify');
      this.isShowNotify = !this.isShowNotify;
    },
    showAdditionalMenu() {
      this.closeAnother('instruments');
      this.isShowAdditionalMenu = !this.isShowAdditionalMenu;
    },
    showLocale() {
      this.closeAnother('locale');
      this.isShowLocale = !this.isShowLocale;
    },
    changeLocale(newLocale) {
      this.closeAnother('locale');
      this.isShowLocale = !this.isShowLocale;
      this.$i18n.setLocale(newLocale);
    },
    closeAnother(value) {
      switch (value) {
        case 'mobile':
          this.isShowProfile = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          this.isShowAdditionalMenu = false;
          break;
        case 'instruments':
          this.isShowProfile = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          break;
        case 'profile':
          this.isShowAdditionalMenu = false;
          this.isShowNotify = false;
          this.isShowLocale = false;
          break;
        case 'locale':
          this.isShowAdditionalMenu = false;
          this.isShowNotify = false;
          this.isShowProfile = false;
          break;
        case 'notify':
          this.isShowAdditionalMenu = false;
          this.isShowProfile = false;
          this.isShowLocale = false;
          break;
        default:
          break;
      }
    },
    closeAll() {
      this.isShowProfile = false;
      this.isShowNotify = false;
      this.isShowAdditionalMenu = false;
      this.isShowLocale = false;
    },
    setLocale(item) {
      this.currentLocale = item;
    },
  },
};
</script>
<style lang="scss" scoped>
.hidden {
  display: none;
}
.mobile {
  &-dropdown {
    border-bottom: 1px solid $black0;
    &__btn {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    &__title {
      padding: 16px 0 20px 20px;
    }
    &__arrow {
      justify-self: flex-end;
      padding: 16px 20px 0 0;
    }
    &__container {}
  }
  &__links {
    display: flex;
    flex-direction: column;
  }
  &__link {
    padding: 16px 20px 16px 20px;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    border-bottom: 1px solid $black0;
    transition: 1s;
    text-decoration: none;
    &:hover {
      @extend .mobile__link;
      background: $blue;
      color: $white;
      font-weight: 600;
    }
  }
}
.instrument-dropdown {
  &__link {
    @extend .mobile__link;
    display: flex;
    flex-direction: column;
    color: $black600;
    padding: 16px 0 20px 35px;
  }
}
.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &-dropdown {
    &__link {
      @extend .mobile__link;
      display: flex;
      flex-direction: column;
      background: $black0;
      padding: 16px 0 20px 20px;
    }
  }
  &-container {
    &__avatar {
      padding: 15px;
    }
    &__user {
      padding: 15px 0 0 0;
      display: grid;
    }
  }
  &__dropdown {
    align-self: center;
  }
  &__container {
    display: flex;
    flex-direction: row;
    background: $black0;
    max-height: 70px;
    height: 100%;
    max-width: 100%;
    width: 100%;
    padding: 0 20px 0 0;
  }
  &__avatar {
    max-height: 40px;
    max-width: 40px;
    height: 100%;
    width: 100%;
    border-radius: 137px;
  }
  &__name {
    font-weight: 500;
    font-size: 16px;
    color: $black800;
  }
  &__role {
    font-weight: 400;
    font-size: 12px;
    color: $blue;
    padding: 0 0 11px 0;
  }
}
.icon {
  font-size: 20px;
  &-caret_down:before {
    @extend .icon;
    content: "\ea48";
    color: #2e3a59;
  }
  &-caret_up:before {
    @extend .icon;
    content: "\ea4b";
    color: #2e3a59;
  }
  &-close_big:before {
    @extend .icon;
    content: "\e948";
    color: #2e3a59;
  }
}
.ctm {
  &-open {
    display: flex;
    width: 100%;
  }
  &__actions {
    padding: 20px;
  }
  &-menu {
    display: none;
    transition: .2s;
    &_opened {
      overflow-y: auto;
      background: $white;
      display: flex;
      width: 100%;
      position: fixed;
      top: 73px;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 9999;
    }
    &__content {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background: $white;
      border-radius: 0 0 5px 5px;
      &_hide {
        width: 0;
      }
    }
  }
}
.primary {
  height: 100vh;
  overflow-y: auto;
}
.template {
  min-height: 100vh;
  background: #F7F8FA;
  &__content {
    display: grid;
    min-height: 100vh;
  }
  &__main {
    display: grid;
    padding-bottom: 80px;
    transition: 1s;
    width: 100%;
  }
}
.notify {
  position: absolute;
  top: calc(72px + 5px);
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.0325794), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 441px;
  z-index: 10000000;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    border-bottom: 1px solid #F7F8FA;
    span:before {
      color: $shade700 !important;
      font-size: 24px;
    }
  }
  &__title {
    @include text-simple;
    @include normal-font-size;
  }
  &__btn {
    background: #F7F8FA;
    border-radius: 3px;
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    span:before {
      color: #0083C7;
      font-size: 24px;
    }
  }
  &__action {
    padding-top: 12px;
  }
  &__content {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
  &__reason {
    padding-top: 12px;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    line-height: 130%;
    &_date {
      font-size: 12px;
      text-align: right;
      color: $black300;
    }
    &_name {
      font-size: 16px;
      color: $black800;
    }
    &_grey {
      font-size: 12px;
      color: $black500;
    }
    &_blue {
      font-size: 16px;
      color: $blue;
      text-align: left;
    }
    &_btn {
      font-size: 16px;
      color: $black800;
    }
  }
  &__items {
    display: grid;
    grid-template-columns: 1fr;
  }
  &__user {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 10px;
  }
  &__info {
    grid-gap: 5px;
    display: grid;
    text-align: left;
    align-items: center;
  }
  &__avatar {
    max-height: 40px;
    max-width: 40px;
    border-radius: 100%;
  }
  &__top {
    display: flex;
    justify-content: space-between;
  }
  &__item {
    min-height: 167px;
    border-bottom: 1px solid #F7F8FA;
    width: 100%;
    display: flex;
    justify-items: flex-start;
    align-items: center;
  }
}
.profile {
  position: absolute;
  top: calc(72px + 5px);
  right: calc(100% - 43px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 223px;
  width: 100%;
  min-height: 235px;
  z-index: 10000000;
  &__header {
    border-bottom: 1px solid #F7F8FA;
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 15px;
    grid-gap: 10px;
  }
  &__avatar {
    max-width: 40px;
    max-height: 40px;
    border-radius: 100%;
  }
  &__items {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: flex-start;
  }
  &__item {
    height: 41px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    width: 100%;
    transition: .3s;
    &_red {
      color: $red;
    }
    &:hover {
      background: #F7F8FA;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black800;
    &_blue {
      font-weight: normal;
      font-size: 12px;
      color: $blue;
    }
    &_green {
      font-weight: normal;
      font-size: 12px;
      color: $green;
    }
  }
  &__info {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
    text-align: left;
  }
}
.header {
  position: sticky;
  top: 0;
  z-index: 99999;
  min-height: 72px;
  background: $white;
  box-shadow: 0 1px 0 #E6E9EC;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &__body {
    max-width: 1180px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__left {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 35px;
  }
  &__link {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black400;
    text-decoration: none;
    &_active {
      color: $black800;
    }
    &_menu {
      display: flex;
      align-items: center;
      position: relative;
      span::before {
        color: $black400;
        font-size: 24px;
        padding-left: 5px;
      }
    }
  }
  &__button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 130%;
    color: $black600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    width: 43px;
    height: 43px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid $black100;
    }
    span:before {
      color: $black400;
      font-size: 24px;
    }
    &_profile {
      position: relative;
    }
    &_menu {
      position: relative;
      display: none;
    }
    &_notify {
      position: relative;
    }
    &_locale {
      width: 86px;
      height: 46px;
      span {
        padding-left: 10px;
      }
    }
  }
  &__links {
    display: flex;
    align-items: center;
    grid-gap: 25px;
  }
  &__right {
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-gap: 10px;
    align-items: center;
  }
  &__btn {
    min-width: 163px;
  }
  &__logo {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr;
    grid-gap: 5px;
    cursor: pointer;
    &_mobile {
      display: none;
    }
    span {
      font-family: 'Inter', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 23px;
      line-height: 130%;
      color: $black700;
    }
  }
}
.menu {
  position: absolute;
  top: 72px;
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 790px;
  width: 100%;
  min-height: 230px;
  z-index: 10000000;
  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    span::before {
      transition: .1s;
      visibility: hidden;
      font-size: 24px;
      color: #2E3A59;
    }
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    &_header {
      font-size: 16px;
      line-height: 130%;
      color: $black800;
    }
    &_grey {
      font-size: 14px;
      line-height: 130%;
      color: $black500;
    }
  }
  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 20px;
    grid-gap: 10px;
  }
  &__item {
    transition: .3s;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid transparent;
    min-height: 90px;
    display: flex;
    align-items: flex-start;
    text-align: left;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    &:hover {
      border: 1px solid $black100;
      .menu {
        &__top {
          span::before {
            visibility: initial;
          }
        }
      }
    }
  }
}
.locale {
  position: absolute;
  top: calc(72px + 5px);
  background: #FFFFFF;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 86px;
  z-index: 10000000;
  &__items {
    padding: 10px 15px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  &__item {
    display: grid;
    grid-template-columns: 15px 1fr;
    grid-gap: 10px;
    align-items: center;
    min-height: 20px;
  }
  &__icon {
    border-radius: 100%;
  }
  &__text {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: $black500;
  }
}
.ctm-menu {
  &__toggle {
    display: none;
  }
}
.modal-active {
  overflow-y: hidden;
}
.footer {
  @include container;
  padding: 25px 0;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid $black100;
  &__left {
    display: flex;
    grid-gap: 15px;
  }
  &__right {
    display: flex;
    grid-gap: 15px;
  }
  &__copy {
    @include text-simple;
    @include normal-font-size;
    font-size: 14px;
    color: $black500;
  }
  &__link {
    @include link;
  }
}
@include _1199 {
  .ctm-menu {
    &__toggle {
      display: flex;
    }
  }
  .header {
    &__button_menu {
      display: flex;
    }
    &__body {
      margin: 0 20px 0 20px;
    }
    &__links {
    }
    &__right {}
    &__button {
      &_profile {
        display: none;
      }
    }
  }
}
@include _991 {
  .header {
    &__btn {
      display: none !important;
    }
  }
}
@include _767 {
  .template {
    &__screen {
      background: rgba(7, 18, 34, 0.6);
      width: 100vw;
      height: 100vh;
      position: fixed;
      z-index: 2;
    }
  }
  .header {
    z-index: 1;
    &_mobile {
      z-index: 5  ;
    }
    &__logo {
      margin-bottom: 50px;
      span {
        font-size: 16px;
      }
      img {
        width: 25px;
      }
      &_mobile {
      display: block;
    }
    }
    &__left {
      display: none;
      &_mobile {
      grid-template-columns: 1fr;
      grid-gap: 0;
      grid-template-rows: auto 1fr;
      align-items: flex-start;
      background: $white;
      padding: 23px 16px;
      height: 70vh;
      position: absolute;
      left: 0;
      top: 0;
      }
    }
    &__links {
      flex-direction: column;
      align-items: flex-start;
      width: 213px;
    }
    &__separator {
      height: 1px;
      background: $black100;
      width: 100%;
      display: block;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    background: $black0;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: baseline;
    padding: 10px 15px;
    height: 30vh;
    width: 245px;
    grid-gap: 20px;
    border: none;
    z-index: 5;
    &__left {
      flex-direction: column;
    }
    &__right {
      flex-direction: column;
    }
  }
}
@include _575 {
  .header {
    &__logo {
      span {
        display: none;
      }
    }
    &__btn {
      display: none !important;
    }
    &__left {
      grid-gap: 15px;
    }
    &__right {
      grid-gap: 2px;
    }
  }
  .notify {
    min-width: 350px;
  }
  .footer {
    &__bottom {
      display: grid;
    }
    &__left {
      grid-column: 1/2;
    }
    &__rights {
      grid-column: 1/2;
    }
    &__rights {
      display: flex;
    }
    &__links {
      display: flex;
    }
    &__top {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 30px;
    }
    &__items {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
      &_links {
        grid-template-columns: 1fr;
      }
    }
  }
}

@include _480 {
  .notify {
    min-width: 300px;
  }
}

@include _380 {
  .notify {
    min-width: 250px;
  }
}
</style>
