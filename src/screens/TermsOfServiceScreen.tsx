import React, { useMemo } from 'react';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  id,
  icon,
  title,
  children,
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

export default function TermsOfServiceScreen() {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  return (
    <div style={s.root}>
      <div style={s.scroll}>
        <div style={s.page}>
          {/* Hero */}
          <div style={s.hero}>
            <span style={s.heroIcon}>📜</span>
            <h1 style={s.h1}>Terms of Service</h1>
            <p style={s.subtitle}>Please read these terms carefully before using the app.</p>
            <span style={s.chip}>Last updated: May 7, 2026</span>
          </div>

          {/* TOC */}
          <div style={s.toc}>
            <div style={s.tocTitle}>CONTENTS</div>
            <ol style={s.tocList}>
              {[
                ['#acceptance', 'Acceptance of Terms'],
                ['#use', 'Use of the App'],
                ['#ip', 'Intellectual Property'],
                ['#disclaimer', 'Disclaimer of Warranties'],
                ['#liability', 'Limitation of Liability'],
                ['#changes', 'Changes to Terms'],
                ['#governing', 'Governing Law'],
                ['#contact', 'Contact Us'],
              ].map(([href, label]) => (
                <li key={href} style={s.tocItem}>
                  <a href={href} style={s.tocLink}>{label}</a>
                </li>
              ))}
            </ol>
          </div>

          {/* 1. Acceptance */}
          <Section id="acceptance" icon="✅" title="Acceptance of Terms" c={c} s={s}>
            <p style={s.p}>
              By downloading, installing, or using <strong style={s.strong}>Noirly Calculator</strong>{' '}
              ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not
              agree to these Terms, do not use the App.
            </p>
            <div style={s.highlight}>
              <strong style={s.highlightStrong}>Note:</strong> These Terms apply to all versions of
              Noirly Calculator, including the web app and any mobile releases.
            </div>
          </Section>

          {/* 2. Use */}
          <Section id="use" icon="📱" title="Use of the App" c={c} s={s}>
            <p style={s.p}>
              Noirly Calculator is provided for personal, non-commercial use. You agree to use the
              App only for lawful purposes and in accordance with these Terms. You must not:
            </p>
            <ul style={s.ul}>
              <li style={s.li}>Use the App in any way that violates any applicable local, national, or international law or regulation.</li>
              <li style={s.li}>Attempt to reverse-engineer, decompile, or disassemble any part of the App.</li>
              <li style={s.li}>Use the App to transmit any unsolicited or unauthorised advertising or promotional material.</li>
              <li style={s.li}>Attempt to gain unauthorised access to any part of the App or its related systems.</li>
            </ul>
          </Section>

          {/* 3. IP */}
          <Section id="ip" icon="©️" title="Intellectual Property" c={c} s={s}>
            <p style={s.p}>
              The App and all its original content, features, and functionality are owned by the
              developers of Noirly Calculator and are protected by applicable intellectual property
              laws.
            </p>
            <p style={s.p}>
              You are granted a limited, non-exclusive, non-transferable, revocable licence to use
              the App solely for your personal, non-commercial purposes.
            </p>
          </Section>

          {/* 4. Disclaimer */}
          <Section id="disclaimer" icon="⚠️" title="Disclaimer of Warranties" c={c} s={s}>
            <p style={s.p}>
              The App is provided on an <strong style={s.strong}>"as is"</strong> and{' '}
              <strong style={s.strong}>"as available"</strong> basis without any warranties of any
              kind, either express or implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <div style={s.warning}>
              While we strive for accuracy in all calculations, you should independently verify
              results before relying on them for critical decisions.
            </div>
          </Section>

          {/* 5. Liability */}
          <Section id="liability" icon="🛡️" title="Limitation of Liability" c={c} s={s}>
            <p style={s.p}>
              To the fullest extent permitted by applicable law, the developers of Noirly Calculator
              shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages arising out of or in connection with your use of the App, even if advised of
              the possibility of such damages.
            </p>
            <p style={s.p}>
              Our total liability to you for all claims arising out of or relating to the App shall
              not exceed the amount you paid, if any, for the App.
            </p>
          </Section>

          {/* 6. Changes */}
          <Section id="changes" icon="📝" title="Changes to Terms" c={c} s={s}>
            <p style={s.p}>
              We reserve the right to modify these Terms at any time. Changes will be indicated by
              updating the <strong style={s.strong}>Last updated</strong> date. Your continued use
              of the App after changes are posted constitutes your acceptance of the revised Terms.
            </p>
            <p style={s.p}>
              We encourage you to review these Terms periodically to stay informed of any updates.
            </p>
          </Section>

          {/* 7. Governing Law */}
          <Section id="governing" icon="⚖️" title="Governing Law" c={c} s={s}>
            <p style={s.p}>
              These Terms shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law provisions. Any disputes arising under these Terms
              shall be resolved through good-faith negotiation between the parties.
            </p>
          </Section>

          {/* 8. Contact */}
          <Section id="contact" icon="✉️" title="Contact Us" c={c} s={s}>
            <p style={s.p}>
              If you have any questions about these Terms of Service, please reach out. We aim to
              respond within <strong style={s.strong}>48 hours</strong>.
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
              © {new Date().getFullYear()}{' '}
              <strong style={{ ...s.strong, color: c.primary }}>Noirly Calculator</strong>. All rights reserved.
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 700,
      color: c.onSurface,
      letterSpacing: '-0.5px',
      margin: 0,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      color: c.onSurfaceVariant,
      margin: 0,
    },
    chip: {
      display: 'inline-block',
      backgroundColor: c.surfaceContainerHigh,
      border: `1px solid ${c.outlineVariant}`,
      borderRadius: 999,
      fontSize: 12,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 650,
      color: c.onSurface,
      margin: 0,
    },
    p: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      color: c.onSurfaceVariant,
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
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
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      color: c.onSurfaceVariant,
      margin: 0,
    },
  };
}
