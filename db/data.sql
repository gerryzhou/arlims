insert into lab_group (name, address_street, address_buildings_and_rooms, address_city, address_state, address_zip, description)
  values ('ARL-MICRO', '3900 NCTR Road', 'Building 26', 'Jefferson', 'AR', '72079', 'ARL Labs Microbiology');

insert into employee (facts_id, username, lab_group_name, email, last_name, first_name, middle_name_or_initial)
  values (1111, 'SCH', 'ARL-MICRO', 'stephen.harris@fda.hhs.gov','Harris', 'Stephen', 'C');
insert into employee (facts_id, username, lab_group_name, email, last_name, first_name, middle_name_or_initial)
  values (2111, 'AA', 'ARL-MICRO', 'ashfaqe.ahmed@fda.hhs.gov','Ahmed', 'Ashfaqe', null);
insert into employee (facts_id, username, lab_group_name, email, last_name, first_name, middle_name_or_initial)
  values (3111, 'JM', 'ARL-MICRO', 'joseph.mendoza@fda.hhs.gov', 'Mendoza', 'Joseph', null);


insert into lab_resource(code, type_name, lab_group_name, description)
  values('ARL00424', 'BALANCE', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('RT10971', 'WATERBATH', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('ARL00190', 'WATERBATH', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('ARL00232', 'WATERBATH', 'ARL-MICRO', null);

insert into lab_resource(code, type_name, lab_group_name, description)
  values('V1-5089993', 'VIDAS', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('V2-5099353', 'VIDAS', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('V3-5122706', 'VIDAS', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('V4-5122707', 'VIDAS', 'ARL-MICRO', null);
insert into lab_resource(code, type_name, lab_group_name, description)
  values('V5-5099389', 'VIDAS', 'ARL-MICRO', null);

insert into test_type(name, description)
  values('IMP-SAL-VIDAS', 'Imported Salmonella - Vidas');

insert into labgroup_testtype (lab_group_name, test_type_name)
  values('ARL-MICRO', 'IMP-SAL-VIDAS');


insert into sampling_method
  (name, description, extracted_grams_per_sub, num_subs, num_comps, comp_grams, num_subs_per_comp)
  values (
    '25gx15S-1C-3375mlB',
    '25 grams from each of 15 subs tested as one 375g composite, 3375mls of pre-enriched broth added',
    25, 15, 1, 375, 15
  );
insert into sampling_method
  (name, description, extracted_grams_per_sub, num_subs, num_comps, comp_grams, num_subs_per_comp)
  values (
    '25gx30S-2C-3375mlB',
    '25 grams from each of 30 subs tested as two 375g composites, 3375mls of pre-enriched broth/composite',
    25, 30, 2, 375, 15
  );

insert into labgrp_testtype_samplingmethod (lab_group_name, test_type_name, sampling_method_name, priority)
  values('ARL-MICRO', 'IMP-SAL-VIDAS', '25gx15S-1C-3375mlB', 1);
insert into labgrp_testtype_samplingmethod (lab_group_name, test_type_name, sampling_method_name, priority)
  values('ARL-MICRO', 'IMP-SAL-VIDAS', '25gx30S-2C-3375mlB', 2);

