![Syntax Status](https://github.com/openemr/openemr/workflows/Syntax/badge.svg?branch=rel-703)
![Styling Status](https://github.com/openemr/openemr/workflows/Styling/badge.svg?branch=rel-703)
![Testing Status](https://github.com/openemr/openemr/workflows/Test/badge.svg?branch=rel-703)

[![Backers on Open Collective](https://opencollective.com/openemr/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/openemr/sponsors/badge.svg)](#sponsors)

# OpenEMR

[OpenEMR](https://open-emr.org) is a Free and Open Source electronic health records and medical practice management application. It features fully integrated electronic health records, practice management, scheduling, electronic billing, internationalization, free support, a vibrant community, and a whole lot more. It runs on Windows, Linux, Mac OS X, and many other platforms.

### Contributing

OpenEMR is a leader in healthcare open source software and comprises a large and diverse community of software developers, medical providers and educators with a very healthy mix of both volunteers and professionals. [Join us and learn how to start contributing today!](https://open-emr.org/wiki/index.php/FAQ#How_do_I_begin_to_volunteer_for_the_OpenEMR_project.3F)

> Already comfortable with git? Check out [CONTRIBUTING.md](CONTRIBUTING.md) for quick setup instructions and requirements for contributing to OpenEMR by resolving a bug or adding an awesome feature 😊.

### Support

Community and Professional support can be found [here](https://open-emr.org/wiki/index.php/OpenEMR_Support_Guide).

Extensive documentation and forums can be found on the [OpenEMR website](https://open-emr.org) that can help you to become more familiar about the project 📖.

### Reporting Issues and Bugs

Report these on the [Issue Tracker](https://github.com/openemr/openemr/issues). If you are unsure if it is an issue/bug, then always feel free to use the [Forum](https://community.open-emr.org/) and [Chat](https://www.open-emr.org/chat/) to discuss about the issue 🪲.

### Reporting Security Vulnerabilities

Check out [SECURITY.md](.github/SECURITY.md)

### API

Check out [API_README.md](API_README.md)

### Docker

Check out [DOCKER_README.md](DOCKER_README.md)

### FHIR

Check out [FHIR_README.md](FHIR_README.md)

### For Developers

If using OpenEMR directly from the code repository, then the following commands will build OpenEMR (Node.js version 20.* is required) :

```shell
composer install --no-dev
npm install
npm run build
composer dump-autoload -o
```

### Local Modifications (Tabs UI & Responsive)

This fork includes targeted fixes and enhancements to the Tabs UI and responsive behavior, designed to work in Docker with bind-mounted `interface/` and `templates/`.

Key changes by file:

- `interface/main/tabs/js/tabs_view_model.js`
  - Keep the active tab in the visible row during overflow recalculation.
  - Ensure at least one tab always remains visible.
  - Swap rule in `activateTab()` so a tab selected from “More” moves into the visible row immediately.

- `templates/interface/main/tabs/tabs_template.html.twig`
  - Removed `with: tabs` scoping to avoid binding errors; now uses `tabs.visibleTabs`/`tabs.moreMenuVisible` directly.
  - Always render tab titles (no hidden labels when inactive).
  - “More” dropdown items prevent default navigation and call `tabClicked` cleanly.

- `interface/main/tabs/main.php`
  - CSS to prevent dropdown clipping and to layer above surrounding UI.
  - “Portal to body” on open for the “More” dropdown to escape stacking contexts (e.g., left menu), then restore on close.
  - Layout width set to 100% so tabs can overflow correctly.
  - Added cache-buster for `custom_bindings.js` to avoid stale caches on mobile.

- `interface/main/tabs/js/custom_bindings.js`
  - On same-origin tab content load, injects a viewport meta tag and small responsive CSS at `max-width: 992px`.
  - Equalizes 2–4 inline inputs (e.g., First/Middle/Last) using a CSS Grid helper (`.oemr-eq`), with delayed passes and resize handling.
  - Propagates the same injection into same-origin nested frames/iframes within tab content.

Changelog summary is kept in `CHANGELOG.md` in this directory.

### Contributors

This project exists thanks to all the people who have contributed. [[Contribute]](CONTRIBUTING.md).
<a href="https://github.com/openemr/openemr/graphs/contributors"><img src="https://opencollective.com/openemr/contributors.svg?width=890" /></a>


### Sponsors

Thanks to our [ONC Certification Major Sponsors](https://www.open-emr.org/wiki/index.php/OpenEMR_Certification_Stage_III_Meaningful_Use#Major_sponsors)!


### License

[GNU GPL](LICENSE)
