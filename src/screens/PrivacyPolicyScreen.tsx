import React, { useMemo } from 'react';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  id,
  icon,
  title,
  children,
  c,
  s,
}: {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
  c: ReturnType<typeof useThemeColors>;
  s: Record<string, React.CSSProperties>;
}) {
  return (
    <section id={id} style={s.section}>
      <div style={s.sectionHeader}>
        <span style={s.sectionIcon}>{icon}</span>
        <h2 style={s.h2}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PrivacyPolicyScreen() {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  return (
    <div style={s.root}>
      <div style={s.scroll}>
        <div style={s.page}>
          {/* Hero */}
          <div style={s.hero}>
            <span style={s.heroIcon}>🔒</span>
            <h1 style={s.h1}>Privacy Policy</h1>
            <p style={s.subtitle}>We respect your privacy. Here is everything you need to know.</p>
            <span style={s.chip}>Last updated: May 7, 2026</span>
          </div>

          {/* TOC */}
          <div style={s.toc}>
            <div style={s.tocTitle}>CONTENTS</div>
            <ol style={s.tocList}>
              {[
                ['#overview', 'Overview'],
                ['#data-collected', 'Data We Collect'],
                ['#local-storage', 'Local Storage'],
                ['#permissions', 'App Permissions'],
                ['#third-party', 'Third-Party Services'],
                ['#children', "Children's Privacy"],
                ['#changes', 'Policy Changes'],
                ['#contact', 'Contact Us'],
              ].map(([href, label]) => (
                <li key={href} style={s.tocItem}>
                  <a href={href} style={s.tocLink}>{label}</a>
                </li>
              ))}
            </ol>
          </div>

          {/* 1. Overview */}
          <Section id="overview" icon="🔒" title="Overview" c={c} s={s}>
            <p style={s.p}>
              <strong style={s.strong}>Noirly Calculator</strong> is a free, offline-first calculator
              application. We are committed to protecting your privacy. This policy describes how the
              app handles information when you use it.
            </p>
            <div style={s.highlight}>
              <strong style={s.highlightStrong}>Short version:</strong> Noirly Calculator does not
              collect, transmit, or share any personal data. All computation and storage happens
              entirely on your device.
            </div>
          </Section>

          {/* 2. Data We Collect */}
          <Section id="data-collected" icon="📋" title="Data We Collect" c={c} s={s}>
            <p style={s.p}>We do <strong style={s.strong}>not</strong> collect any of the following:</p>
            <ul style={s.ul}>
              <li style={s.li}>Personal identifiers (name, email address, phone number)</li>
              <li style={s.li}>Location data</li>
              <li style={s.li}>Device identifiers or advertising IDs</li>
              <li style={s.li}>Usage analytics or crash reports sent to our servers</li>
              <li style={s.li}>Financial or payment information</li>
              <li style={s.li}>Any data from your clipboard or contacts</li>
            </ul>
            <p style={s.p}>No account creation is required and no sign-in is ever requested.</p>
          </Section>

          {/* 3. Local Storage */}
          <Section id="local-storage" icon="💾" title="Local Storage" c={c} s={s}>
            <p style={s.p}>
              Noirly Calculator stores the following data{' '}
              <strong style={s.strong}>locally on your device only</strong>:
            </p>
            <ul style={s.ul}>
              <li style={s.li}><strong style={s.strong}>Calculation history</strong> — past calculations you have performed.</li>
              <li style={s.li}><strong style={s.strong}>App preferences</strong> — your chosen theme (light / dark / system), and other settings you configure.</li>
              <li style={s.li}><strong style={s.strong}>Graph expressions</strong> — function expressions you have entered in the Graphing screen.</li>
            </ul>
            <div style={s.highlight}>
              This data never leaves your device. It is stored using the device's local storage and
              is only accessible by the app itself. You can clear it at any time from within the
              app's Settings screen.
            </div>
          </Section>

          {/* 4. Permissions */}
          <Section id="permissions" icon="🛡️" title="App Permissions" c={c} s={s}>
            <p style={s.p}>
              Noirly Calculator requests <strong style={s.strong}>no special device permissions</strong>.
              It does not require access to:
            </p>
            <ul style={s.ul}>
              <li style={s.li}>Camera or microphone</li>
              <li style={s.li}>Contacts or call logs</li>
              <li style={s.li}>Location services</li>
              <li style={s.li}>Files or media storage beyond its own sandboxed data</li>
              <li style={s.li}>Network / internet access</li>
            </ul>
            <p style={s.p}>The app functions fully offline. No network connection is required or used at any point.</p>
          </Section>

          {/* 5. Third-Party */}
          <Section id="third-party" icon="🔗" title="Third-Party Services" c={c} s={s}>
            <p style={s.p}>
              Noirly Calculator does <strong style={s.strong}>not</strong> integrate any third-party
              SDKs that collect personal data, including:
            </p>
            <ul style={s.ul}>
              <li style={s.li}>No advertising networks</li>
              <li style={s.li}>No analytics platforms (e.g. Firebase Analytics, Mixpanel)</li>
              <li style={s.li}>No crash-reporting services that transmit data externally</li>
              <li style={s.li}>No social login providers</li>
            </ul>
            <div style={s.warning}>
              If you download the app via the Google Play Store or Apple App Store, those platforms
              may collect their own usage data governed by their respective privacy policies, which
              are outside our control.
            </div>
          </Section>

          {/* 6. Children */}
          <Section id="children" icon="👦" title="Children's Privacy" c={c} s={s}>
            <p style={s.p}>
              Noirly Calculator is suitable for users of all ages. Because the app collects no
              personal data whatsoever, it is safe for use by children. It fully complies with the{' '}
              <strong style={s.strong}>Children's Online Privacy Protection Act (COPPA)</strong> and
              equivalent regulations in other jurisdictions.
            </p>
          </Section>

          {/* 7. Changes */}
          <Section id="changes" icon="📝" title="Changes to This Policy" c={c} s={s}>
            <p style={s.p}>
              We may update this Privacy Policy from time to time. Any changes will be reflected by
              updating the <strong style={s.strong}>Last updated</strong> date at the top of this
              page. We encourage you to review this page periodically for any changes.
            </p>
            <p style={s.p}>
              Continued use of the app after any modifications to this policy constitutes your
              acknowledgement of the changes.
            </p>
          </Section>

          {/* 8. Contact */}
          <Section id="contact" icon="✉️" title="Contact Us" c={c} s={s}>
            <p style={s.p}>
              If you have any questions or concerns about this Privacy Policy, please reach out.
              We aim to respond within <strong style={s.strong}>48 hours</strong>.
            </p>
            <div style={s.contactCard}>
              <div style={s.contactDot} />
              <div>
                <div style={s.contactLabel}>Email</div>
                <a href="mailto:aneeshpissay330@gmail.com" style={s.contactValue}>
                  aneeshpissay330@gmail.com
                </a>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <div style={s.pageFooter}>
            <p style={s.pageFooterText}>
              © {new Date().getFullYear()} <strong style={{ ...s.strong, color: c.primary }}>Noirly Calculator</strong>. All rights reserved.
            </p>
            <p style={{ ...s.pageFooterText, marginTop: 4 }}>This app is provided as-is with no warranty.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(c: Colors): Record<string, React.CSSProperties> {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: c.background,
      overflow: 'hidden',
    },
    scroll: {
      flex: 1,
      overflowY: 'auto',
    },
    page: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '40px 24px 64px',
    },
    hero: {
      textAlign: 'center',
      marginBottom: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    },
    heroIcon: {
      fontSize: 40,
    },
    h1: {
      fontSize: 32,
      fontFamily: 'Manrope',
      fontWeight: 700,
      color: c.onSurface,
      letterSpacing: '-0.5px',
      margin: 0,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      margin: 0,
    },
    chip: {
      display: 'inline-block',
      backgroundColor: c.surfaceContainerHigh,
      border: `1px solid ${c.outlineVariant}`,
      borderRadius: 999,
      fontSize: 12,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      padding: '4px 14px',
    },
    toc: {
      backgroundColor: c.surfaceContainerLow,
      border: `1px solid ${c.outlineVariant}`,
      borderRadius: 16,
      padding: '20px 24px',
      marginBottom: 24,
    },
    tocTitle: {
      fontSize: 11,
      fontFamily: 'Manrope',
      fontWeight: 700,
      letterSpacing: '1px',
      color: c.onSurfaceVariant,
      marginBottom: 12,
    },
    tocList: {
      paddingLeft: 18,
      columns: 2,
      columnGap: 24,
      margin: 0,
    },
    tocItem: {
      fontSize: 13,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      marginBottom: 6,
      breakInside: 'avoid',
    },
    tocLink: {
      color: c.onSurfaceVariant,
      textDecoration: 'none',
    } as React.CSSProperties,
    section: {
      backgroundColor: c.surfaceContainerLow,
      border: `1px solid ${c.outlineVariant}`,
      borderRadius: 16,
      padding: '24px 28px',
      marginBottom: 16,
    },
    sectionHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14,
    },
    sectionIcon: {
      fontSize: 22,
      flexShrink: 0,
    },
    h2: {
      fontSize: 16,
      fontFamily: 'Manrope',
      fontWeight: 650,
      color: c.onSurface,
      margin: 0,
    },
    p: {
      fontSize: 14,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      lineHeight: 1.7,
      margin: '0 0 10px',
    },
    strong: {
      color: c.onSurface,
      fontWeight: 600,
    },
    ul: {
      paddingLeft: 22,
      margin: '0 0 10px',
    },
    li: {
      fontSize: 14,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      lineHeight: 1.7,
      marginBottom: 4,
    },
    highlight: {
      backgroundColor: `${c.primary}14`,
      borderLeft: `3px solid ${c.primary}`,
      borderRadius: '0 8px 8px 0',
      padding: '12px 16px',
      marginTop: 12,
      fontSize: 13,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      lineHeight: 1.6,
    },
    highlightStrong: {
      color: c.primary,
      fontWeight: 600,
    },
    warning: {
      backgroundColor: `${c.secondary}14`,
      borderLeft: `3px solid ${c.secondary}`,
      borderRadius: '0 8px 8px 0',
      padding: '12px 16px',
      marginTop: 12,
      fontSize: 13,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      lineHeight: 1.6,
    },
    contactCard: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: c.surfaceContainerHigh,
      border: `1px solid ${c.outlineVariant}`,
      borderRadius: 12,
      padding: '14px 18px',
      marginTop: 14,
    },
    contactDot: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: '#34d399',
      flexShrink: 0,
    },
    contactLabel: {
      fontSize: 11,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 14,
      fontFamily: 'Manrope',
      fontWeight: 600,
      color: c.primary,
      textDecoration: 'none',
    } as React.CSSProperties,
    pageFooter: {
      textAlign: 'center',
      marginTop: 48,
      paddingTop: 28,
      borderTop: `1px solid ${c.outlineVariant}`,
    },
    pageFooterText: {
      fontSize: 13,
      fontFamily: 'Manrope',
      color: c.onSurfaceVariant,
      margin: 0,
    },
  };
}
