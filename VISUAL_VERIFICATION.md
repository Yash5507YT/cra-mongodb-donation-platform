# Visual verification notes

The standalone Create React App preview was visually reviewed locally on 24 August 2026.

| View | Result |
|---|---|
| Public homepage | The deep-pine hero, high-contrast calls to action, editorial typography, campaign discovery controls, and responsive layout rendered correctly. With no MongoDB API running in the preview, the designed empty campaign state appeared as intended. |
| Authentication page | The split-layout sign-in interface, clear password/email fields, account-mode toggle, and role-protection explanation rendered correctly. |

The protected-route smoke test was started using an isolated in-memory MongoDB server and development-only donor credentials. The sign-in form accepted the input but did not complete from the externally proxied frontend preview because its default API target is `http://localhost:5000/api`. The local-run configuration is correct for a browser running on the same machine; the temporary external preview needs an explicit API target for this smoke test.

The temporary frontend preview was then restarted with the exposed API URL, and the donor credentials were entered again successfully. The next interaction submits the request and validates the dashboard route.

The donor sign-in completed successfully. The protected donor dashboard displayed the authenticated identity, contribution total, supported-cause count, donation history, receipt number, and accepted status. After sign-out, the public campaign card correctly rendered the seeded campaign's category, supporter count, 29% progress, and funding values.

The temporary NGO credentials were entered successfully on the protected sign-in screen. The next interaction validates the organization campaign workspace and its donation-management modal.

The NGO workspace loaded successfully with the organization identity, active campaign, live funding/progress values, publish/pause action, and campaign donation action. The donation-management modal opened successfully and displayed the supporter record, receipt, amount, current accepted status, and controlled status selector.

The NGO modal closed and the organization session signed out cleanly, returning to the public campaign listing. The remaining smoke-test step is administrator workspace review.

The temporary administrator credentials were entered successfully on the same role-protected sign-in screen. The next interaction validates the administrator controls and oversight tabs.

The administrator workspace loaded successfully with platform totals, a users-and-access table, role selectors, account enable/disable controls, and an activity audit list. The donation oversight tab also rendered correctly, showing the temporary contribution, its receipt/campaign/amount, and the protected status selector.

## Master page and certificate update

The revised landing page was reviewed after the master-page update. It correctly opens as the public first view and presents clear **Login** and **Register** actions in the navigation and project overview. The new overview explains donor, NGO, and administrator responsibilities, while the certificate section explains the printable record and visibly includes a Sahyog verification coin/seal. The certificate route and print styles were also compiled successfully in the production Create React App build.

The updated Login query link was also opened successfully before the certificate smoke test, confirming that the master-page authentication entry point reaches the expected sign-in view.

During the seeded certificate smoke test, the donor signed in successfully and the protected dashboard displayed the contribution, receipt `SAH-CERT-001`, amount, accepted status, and a dedicated **Certificate** action for that donation.

The real certificate opened successfully from that dashboard. It rendered the donor name, receipt number, date, monetary donation detail, status, authorized-record text, and the gold Sahyog verification seal. The visible print control invoked the browser print flow; the automation call timed out while waiting for the native dialog, which is expected for this browser environment. The certificate's production build and its dedicated A4 landscape `@media print` rules were verified, including removal of navigation controls during printing.

To make the browser-independent validation explicit, a dedicated **Preview print layout** control was added and loaded on the real donor certificate alongside the native print action.

The print-layout preview was enabled successfully. It removed all navigation and action controls, retained the complete A4-style certificate frame, kept the donor name, receipt `SAH-CERT-001`, date, contribution detail, and accepted status readable, and preserved the centered Sahyog gold seal without overlap. This mirrors the print-specific layout rules used by the browser print action.

The responsive CSS includes a reduced-motion override, and the production Create React App build completed successfully after this review.
