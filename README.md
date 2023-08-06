# Variable Translate

This is a VS Code extension that automatically translates variable names into Chinese.

## Main Features
- Supports automatic translation of variable names into Chinese
- Can enable/disable translation function via the command panel
- When translation is enabled, it listens for document changes and translates variables in real time
- Provides a configuration item to customize the OpenAI API Key
- Upon activation, users are prompted to enter the Key, if not entered, the default trial Key is used
- The trial Key has a call limit, and users are again prompted to enter the Key once the limit is reached
- Users are notified when the translation status is toggled on/off

## How to Use
- Toggle translation through the "Toggle Variable Translate" command in the command panel
- Users are prompted to enter the OpenAI Key when the plugin is activated
- After enabling translation, editing variables will be translated into Chinese comments in real time
- When the trial Key reaches its limit, you will be prompted to re-enter the Key

## Open Source
This plugin is open source on GitHub.

**Welcome to submit issues or PRs to contribute!**
