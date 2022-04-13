<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__main">
        <div
          v-click-outside="closeAll"
          class="template__header header__desktop"
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
                  v-for="(item, i) in menuLinks"
                  :key="`${i}-desktop`"
                  :to="item.path"
                  class="header__link"
                  exact
                >
                  {{ item.title }}
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
                      :key="`${i}-locale`"
                      class="locale__container"
                    >
                      <div
                        class="locale__items"
                        @click="setLocale(item)"
                      >
                        <img
                          :src="require(`~/assets/img/app/${item}.svg`)"
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
                @click="toggleMobileMenu()"
              >
                <button class="header__button header__button_menu">
                  <span :class="{'icon-hamburger': !isMobileMenu, 'icon-close_big': isMobileMenu}" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- mobile header -->
        <div
          class="header__mobile"
          :class="{'header__mobile_visible': isMobileMenu}"
        >
          <div
            v-if="isMobileMenu"
            class="header__left_mobile"
          >
            <div class="header__links">
              <span
                v-for="(item, i) in menuLinks"
                :key="`${i}-mobileMenuLinks`"
                @click="toggleMobileMenu()"
              >
                <nuxt-link
                  :to="item.path"
                  class="header__link"
                  exact
                >
                  {{ item.title }}
                </nuxt-link>
              </span>
            </div>
          </div>
        </div>
        <div
          class="template__content"
          :class="{'hidden': isMobileMenu}"
        >
          <nuxt :key="$route.query.page || $route.path" />
        </div>
        <div class="template__footer footer">
          <div class="footer__left">
            <p class="footer__copy">
              © Workquest {{ new Date().getFullYear() }}
            </p>
            <p class="footer__copy">
              {{ $t('ui.rights') }}
            </p>
          </div>
          <div class="footer__right">
            <a
              v-for="(item, i) in footerLinks"
              :key="`${i}-footerLink`"
              target="_blank"
              rel="noopener"
              :href="item.path"
              class="footer__link"
            >
              · {{ item.title }}
            </a>
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
import { links } from '~/utils/config';

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
    menuLinks() {
      return [
        {
          title: this.$t('ui.home'),
          path: '/',
        },
        {
          title: this.$t('ui.txs'),
          path: '/tx',
        },
        {
          title: this.$t('ui.blocks'),
          path: '/blocks',
        },
        {
          title: this.$t('ui.transfers'),
          path: '/transfers',
        },
        {
          title: this.$t('ui.tokens'),
          path: '/tokens',
        },
      ];
    },
    footerLinks() {
      return [
        {
          title: this.$t('ui.terms'),
          path: links.terms,
        },
        {
          title: this.$t('ui.privacy'),
          path: links.privacy,
        },
      ];
    },
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
      this.closeAnother('mobile');
    },
    toMain() {
      this.$router.push('/');
    },
    closeMenuByLink() {
      this.toMain();
      this.toggleMobileMenu();
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
    changeLocale() {
      this.closeAnother('locale');
      this.isShowLocale = !this.isShowLocale;
      this.$i18n.setLocale(this.currentLocale);
      this.$moment.locale(this.currentLocale);
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
      this.changeLocale();
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  font-size: 20px;
}

.primary {
  overflow-y: hidden;
}

.template {

  &__main {
    display: grid;
    min-height: 100vh;
    background: #F7F8FA;
    grid-template-rows: auto 1fr auto;
    margin: 0;
  }

  &__header {
    min-height: 72px;
  }

  &__content {
  }
  &__footer {
    min-height: 75px;
  }
}

.header {
  &__desktop {
    position: sticky;
    top: 0;
    z-index: 100;
    background: $white;
    box-shadow: 0 1px 0 #E6E9EC;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__mobile {
    display: none;
  }

  &__body {
    @include container;
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

    &_mobile {
      display: none;
    }
  }

  &__link {
    @include text-simple;
    @include normal-font-size;
    color: $black400;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }

    &_active {
      color: $black800;
    }

    &_menu {
      display: flex;
      align-items: center;
      position: relative;

      span {
        color: $black400;
        font-size: 24px;
        padding-left: 5px;
      }
    }
  }

  &__button {
    @include text-simple;
    @include normal-font-size;
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

    span {
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
        padding-left: 3px;
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
    grid-template-columns: repeat(2, auto);
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
      @include text-simple;
      @include normal-font-size;
      font-weight: bold;
      font-size: 23px;
      color: $black700;
    }
  }
}

.locale {
  position: absolute;
  top: calc(72px + 5px);
  background: $white;
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
    border-radius: 50%;
    width: 80%;
  }

  &__text {
    @include text-simple;
    @include normal-font-size;
    font-weight: 500;
    color: $black500;
  }
}

.ctm-menu {
  &__toggle {
    display: none;
  }
}

.footer {
  @include container;
  padding: 25px 0;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid $black100;

  &_mobile {
    display: none;
  }

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
    &__right {
      grid-gap: 0;
    }

    &__button {
      &_profile {
        display: none;
      }
    }
  }
}

@include _991 {
  .header {
    &__text {
      display: none;
    }
    &__btn {
      display: none !important;
    }

    &__right {
      grid-gap: 0;
    }

    &__logo {
      grid-gap: 0;

      img {
        width: 30px;
      }

      span {
        font-size: 19px;
      }
    }

    &__links {
      grid-gap: 10px;
    }

    &__link {
      font-size: 17px;
      white-space: nowrap;
    }
  }
}

@include _767 {
  .header {
    z-index: 5;

    &__mobile {
      z-index: 2;
      &_visible {
        display: block;
      }
    }

    &__button_menu {
      display: flex;
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
        display: inline-block;
        background: $white;
        padding: 20px;
        height: 100vh;
        width: 100vw;
        position: absolute;
        left: 0;
        top: 72px;
      }
    }

    &__links {
      flex-direction: column;
      align-items: flex-start;
      &>span {
        width: 100%;
        &:nth-child(3){
          border-bottom: 1px solid $black100;
          padding-bottom: 10px;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    padding: 25px 15px;
  }
  .hidden {
    overflow: hidden;
    visibility: hidden;
  }
}

@include _575 {
  .header {
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
    &__right {
      flex-direction: column;
    }

    &__bottom {
      display: grid;
    }

    &__left {
      flex-direction: column;
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
