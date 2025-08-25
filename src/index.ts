declare global {
  var windowControls: any;
  var closeWindow: any;
  var minWindow: any;
  var maxWindow: any;
}

import { Plugin, showMessage, getFrontend } from "siyuan";
import "@/index.scss";

import { SettingUtils } from "./libs/setting-utils";
import { build_css } from "./css_injection";

import { sy_hardcoded_name_map } from "./sy_hardcoded_name_map";

import { get_human_readable_name_by_identifier_from_map } from "./dynamic_i18n";
const STORAGE_NAME = "menu-config";

const frontEnd = getFrontend();

// TODO: use User-Agent Client Hints API to get platform

// if (navigator.userAgentData) {
//     navigator.userAgentData.getHighEntropyValues(["platform"])
//         .then(platform => {
//             console.log(platform);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// } else {
//     console.log('User-Agent Client Hints API not supported.');
// }

// const opration_system = navigator.platform.toLocaleLowerCase();
// const targetNode = document.getElementById("commonMenu"); //it's the menu's id, fetch firstly and hoping it increase some performance.

export default class siyuan_rmv_btn extends Plugin {
  private settingUtils: SettingUtils;
  private isMobile: boolean;

  async onload() {
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

    this.settingUtils = new SettingUtils(this, STORAGE_NAME);
    this.settingUtils.load();

    
    // this.settingUtils.addItem({
    //   key: "seperateHandlePolicy",
    //   value: 1,
    //   type: "select",
    //   title: this.i18n.seperateHandlePolicy,
    //   description: this.i18n.seperateHandlePolicydesc,
    //   options: {
    //     1: this.i18n.seperateHandlePolicyDontTouch,
    //     2: this.i18n.seperateHandlePolicyHideAll,
    //     3: this.i18n.seperateHandlePolicyHideIfTwoMeetEachOther,
    //     5: "@zxhd863943427",
    //   },
    // });

    for (const [key] of sy_hardcoded_name_map) {
      if (key.startsWith("slash_menu_")) {
        continue;
      }
      if (key.startsWith("block_menu_")) {
        const allowed = new Set([
          "block_menu_ai",
          "block_menu_wechat_reminder",
          "block_menu_quick_make_card",
        ]);
        if (!allowed.has(key)) {
          continue;
        }
      }
      if (key.startsWith("editor_menu_")) {
        const allowedEditor = new Set([
          "editor_menu_start_record",
          "editor_menu_net_img_to_local",
          "editor_menu_net_assets_to_local",
          "editor_menu_upload_assets_to_cdn",
          "editor_menu_share_to_liandi",
          "editor_menu_optimize_typography",
        ]);
        if (!allowedEditor.has(key)) {
          continue;
        }
      }
      if (key.startsWith("top_bottom_bar_")) {
        const allowedTopBottom = new Set([
          "top_bottom_bar_sync",
          "top_bottom_bar_day_night",
          "top_bottom_bar_crown",
          "top_bottom_bar_help",
          "top_bottom_bar_hidden_sidebar",
        ]);
        if (!allowedTopBottom.has(key)) {
          continue;
        }
      }
      if (key.startsWith("side_bar_")) {
        const allowedSidebar = new Set([
          "side_bar_outline",
          "side_bar_inbox",
          "side_bar_bookmark",
          "side_bar_tag",
          "side_bar_backlink",
          "side_bar_global_graph",
          "side_bar_notebook_graph",
        ]);
        if (!allowedSidebar.has(key)) {
          continue;
        }
      }
      this.settingUtils.addItem({
        key: key,
        value: false,
        type: "checkbox",
        title: get_human_readable_name_by_identifier_from_map(
          key,
          sy_hardcoded_name_map
        ),
      });
    }

    

    if (this.isMobile) {
      this.addTopBar({
        icon: "iconDock",
        title: this.isMobile
          ? this.i18n.rmvBtnSetting
          : this.i18n.rmvBtnSetting,
        position: "right",
        callback: () => {
          if (this.isMobile) {
            this.openSetting();

            // this.addMenu();
            // console.log("mobile");

            //   } else {
            //     let rect = topBarElement.getBoundingClientRect();
            //     if (rect.width === 0) {
            //       rect = document.querySelector("#barMore").getBoundingClientRect();
            //     }
            //     if (rect.width === 0) {
            //       rect = document
            //         .querySelector("#barPlugins")
            //         .getBoundingClientRect();
            //     }
            //     // this.swapStreamerMode();
          }
        },
      });
    }
  }

  onLayoutReady() {
    this.loadData(STORAGE_NAME);
    this.settingUtils.load();

    build_css(this.settingUtils, sy_hardcoded_name_map);
  }

  async onunload() {
    // await this.settingUtils.save();
    // this.reloadInterface();
  }

  uninstall() {
    this.removeData(STORAGE_NAME);
    showMessage(this.i18n.uninstall_hint);
  }
}
