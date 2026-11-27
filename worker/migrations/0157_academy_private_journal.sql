-- Private journal: no teacher, group, AI or public access. Entries belong to the
-- verified account AND exact participant and workshop, not simply the family.
CREATE TABLE support_academy_journal_entries (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
 audience TEXT NOT NULL CHECK(audience IN ('minor','adult')),
 participant_id TEXT NOT NULL,
 class_id TEXT NOT NULL REFERENCES support_english_classes(id) ON DELETE RESTRICT,
 title TEXT NOT NULL CHECK(length(title)<=120),
 body TEXT NOT NULL CHECK(length(body)<=12000),
 reflection TEXT NOT NULL CHECK(length(reflection)<=2000),
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision>=1),
 updated_at TEXT NOT NULL,
 PRIMARY KEY(user_id,family_id,audience,participant_id,class_id)
);
CREATE VIEW support_academy_journal_access AS
 SELECT DISTINCT p.parent_user_id user_id,p.family_id,'minor' audience,p.learner_id participant_id,l.label participant_name,r.id round_id,r.curriculum_id programme_id,r.title programme_title,c.id class_id,x.sequence,c.topic,c.start_at
 FROM support_portal_enquiries p JOIN support_portal_learners l ON l.id=p.learner_id AND l.family_id=p.family_id
 JOIN support_english_enrolments e ON e.request_id=p.request_id AND e.status='paid'
 JOIN support_guest_requests g ON g.id=p.request_id AND g.status NOT IN ('closed','resolved')
 JOIN users u ON u.id=p.parent_user_id AND u.family_id=p.family_id AND u.email=g.email
 JOIN support_english_classes c ON c.id=e.class_id JOIN support_english_round_classes x ON x.class_id=c.id JOIN support_english_rounds r ON r.id=x.round_id
 WHERE p.service='english-club' AND r.curriculum_id IN ('english-creative-camp-junior-v1','english-creative-camp-senior-v1') AND r.price_version='academy-launch-v1'
 AND (l.parent_user_id=p.parent_user_id OR EXISTS(SELECT 1 FROM students s WHERE s.id=l.student_id AND s.family_id=l.family_id))
 UNION
 SELECT DISTINCT b.user_id,b.family_id,'adult',b.user_id,a.display_name,r.id,r.curriculum_id,r.title,c.id,x.sequence,c.topic,c.start_at
 FROM support_academy_adult_bookings b JOIN support_academy_adult_participants a ON a.user_id=b.user_id AND a.family_id=b.family_id
 JOIN support_academy_adult_seats s ON s.booking_id=b.id AND s.user_id=b.user_id AND s.status='provisional'
 JOIN support_english_round_classes x ON x.class_id=s.class_id AND x.round_id=b.round_id JOIN support_english_classes c ON c.id=x.class_id
 JOIN support_english_rounds r ON r.id=b.round_id AND r.curriculum_id='english-author-studio-adult-v1'
 JOIN support_academy_adult_obligations o ON o.booking_id=b.id AND o.status='awaiting_invoice' AND (o.sequence=0 OR o.sequence=x.sequence)
 JOIN support_academy_adult_settlements v ON v.obligation_id=o.id AND v.amount_cents=o.amount_cents
 JOIN support_academy_adult_publications pub ON pub.obligation_id=o.id AND pub.invoice_id=v.invoice_id AND pub.issued_at IS NOT NULL
 JOIN support_academy_adult_invoice_intents i ON i.obligation_id=o.id AND i.fingerprint=pub.fingerprint AND i.provider_invoice_id=v.invoice_id
 WHERE NOT EXISTS(SELECT 1 FROM support_academy_adult_financial_holds h WHERE h.obligation_id=o.id)
 AND EXISTS(SELECT 1 FROM json_each(json_extract(i.snapshot_json,'$.snapshot.seats_json')) j WHERE json_extract(j.value,'$.seat_id')=s.id AND json_extract(j.value,'$.class_id')=s.class_id AND json_extract(j.value,'$.start_at')=c.start_at AND json_extract(j.value,'$.end_at')=c.end_at AND json_extract(j.value,'$.due_at')=s.due_at);
