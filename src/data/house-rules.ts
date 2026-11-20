// ============================================================
// House rules every guest agrees to at check-in (checkin.html).
//
// Copied word for word from the owners' Google Doc "Guest
// Conduct, Assumption of Risk & Property Policy Acknowledgement"
// (Gokarma_Final_Indemnity_Form.docx), 2026-11-20. The only
// change: the Doc says "Gokarna Living" in three places; here it
// is "Gokarma Living", the real name.
//
// If the owners change the wording, change it here AND update
// rulesVersion in src/config/checkin.ts.
// ============================================================

export interface HouseRule {
  title: string;
  text: string;
}

export const RULES_TITLE = 'Guest Conduct, Assumption of Risk & Property Policy Acknowledgement';

export const RULES_INTRO =
  'By checking in to and/or remaining on the premises of Aangan by Gokarma Living ("Property"), I acknowledge that I have read, understood, and agree to comply with the following rules and conditions of stay:';

export const HOUSE_RULES: HouseRule[] = [
  {
    title: 'Prohibited Substances',
    text: 'The possession, consumption, distribution, sale, or use of illegal drugs, narcotics, psychotropic substances, or other prohibited substances is strictly forbidden anywhere on the Property. The possession or consumption of alcohol is also prohibited unless specifically authorized by Management.',
  },
  {
    title: 'Conduct and Behaviour',
    text: 'Guests are expected to behave respectfully toward other guests, staff, neighbours, and visitors. Threatening, abusive, harassing, violent, disruptive, unlawful, or property-damaging behaviour, including excessive noise, theft, or vandalism, is strictly prohibited.',
  },
  {
    title: 'Right of Removal',
    text: 'Management reserves the right, at its sole discretion, to immediately terminate a guest’s stay and require the guest to vacate the premises without refund if the guest violates this policy, possesses or uses prohibited substances, engages in abusive or disruptive conduct, or otherwise poses a risk to the safety, wellbeing, reputation, or operations of the Property.',
  },
  {
    title: 'Release of Liability',
    text: 'To the fullest extent permitted by law, Aangan by Gokarma Living, its owners, employees, and representatives shall not be liable for injury, loss, theft, damage, or inconvenience arising from a guest’s stay, except where caused by gross negligence or wilful misconduct.',
  },
  {
    title: 'Indemnity',
    text: 'Guests agree to be responsible for and indemnify Aangan by Gokarma Living against losses, claims, damages, costs, or liabilities arising from the guest’s actions, misconduct, breach of these rules, or damage caused to persons or property.',
  },
  {
    title: 'Liability for Damages',
    text: 'Guests shall be financially responsible for any loss, damage, destruction, repair, replacement, or excessive cleaning costs resulting from their actions or the actions of persons accompanying them.',
  },
  {
    title: 'Reporting to Authorities',
    text: 'Where required by law, or where Management reasonably believes illegal activity has occurred, Management may notify and cooperate with law enforcement authorities and provide relevant information or evidence.',
  },
  {
    title: 'Guest Responsibility',
    text: 'Guests are responsible for complying with all Property rules and for ensuring that any person accompanying them also complies with such rules while on the Property.',
  },
  {
    title: 'Fines and Penalties',
    text: 'Guests found violating any of the above-mentioned rules may be subject to a fine of ₹1,000 per violation, at the discretion of Management.',
  },
  {
    title: 'Late Check-out Charges',
    text: 'Check-out time is 10:30 AM. Any check-out beyond this time without prior intimation and approval from Management will attract a late check-out charge of ₹400.',
  },
  {
    title: 'Acknowledgement',
    text: 'I acknowledge that these rules have been explained to me and that failure to comply may result in immediate removal from the Property without refund and, where applicable, reporting to the appropriate authorities.',
  },
];
