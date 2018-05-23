
insert into sampling_test_units(description, standard_priority) values
  ('25 grams from each of 15 subs tested as one 375g composite, 3375mls of pre-enriched broth added', 1);
insert into sampling_test_units(description, standard_priority) values
  ('25 grams from each of 30 subs tested as two 375g composites, 3375mls of pre-enriched broth/composite', 2);

insert into medium_type(code, description) values
  ('LAC', 'Lactose');
insert into medium_type(code, description) values
  ('TSB', 'TSB');
insert into medium_type(code, description) values
  ('RV',  'RV');
insert into medium_type(code, description) values
  ('TT',  'TT');
insert into medium_type(code, description) values
  ('MBR',  'M Broth');

insert into analyst(id, name, email) values
  ('AA', 'Ashfaqe Ahmed',  'Ashfaqe.Ahmed@fda.hhs.gov');
insert into analyst(id, name, email) values
  ('JM', 'Joseph Mendoza', 'Joseph.Mendoza@fda.hhs.gov');

insert into labeling_attachment_type (code, text) values
  ('NONE',  'None');
insert into labeling_attachment_type (code, text) values
  ('ORIG',  'Attached original');
insert into labeling_attachment_type (code, text) values
  ('COPY',  'Attached copy');
insert into labeling_attachment_type (code, text) values
  ('ALONE', 'Submitted alone');

insert into system_utensil(id, description) values
  ('knf', 'knife');
insert into system_utensil(id, description) values
  ('spn', 'spoon');
insert into system_utensil(id, description) values
  ('spt', 'spatula');

-- TODO: Insert collectors.

insert into reserve_sample_disposition (code, text) values
  ('NONE',  'No reserve sample.');
insert into reserve_sample_disposition (code, text) values
  ('DISC',  'Sample discarded after analysis.');
insert into reserve_sample_disposition (code, text) values
  ('SENT',  'Isolates sent.');
insert into reserve_sample_disposition (code, text) values
  ('OTHER', 'Other');

