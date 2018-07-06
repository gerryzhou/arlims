insert into lab_group (name, address_street, buildings_and_rooms, address_city, address_state, address_zip, description)
  values ('ARL-MICRO', '3900 NCTR Road', 'Building 26', 'Jefferson', 'AR', '72079', 'ARL Labs Microbiology');

insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name)
  values (1234567, 'stephen.harris', 'SCH', (select id from lab_group where name = 'ARL-MICRO'), 'Harris', 'Stephen', 'C');

insert into role(name, description)
  values('USER', 'regular user');
insert into role(name, description)
  values('ADMIN', 'administrator');

insert into employee_role(emp_id, role_id)
  values((select id from employee where short_name='SCH'),(select id from role where name='USER'));
insert into employee_role(emp_id, role_id)
  values((select id from employee where short_name='SCH'),(select id from role where name='ADMIN'));

insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00424', 'BAL', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('RT10971', 'WAB', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00190', 'WAB', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00232', 'WAB', (select id from lab_group where name = 'ARL-MICRO'), null);

insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V1-5089993', 'VID', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V2-5099353', 'VID', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V3-5122706', 'VID', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V4-5122707', 'VID', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V5-5099389', 'VID', (select id from lab_group where name = 'ARL-MICRO'), null);

insert into test_type(code, short_name, name)
  values('MICRO_IMP_SAL_VIDAS', 'IMP SLM VIDAS', 'Imported Salmonella - Vidas');

insert into lab_group_test_type (lab_group_id, test_type_id, test_configuration_json)
  values(
    (select id from lab_group where name = 'ARL-MICRO'),
    (select id from test_type where code='MICRO_IMP_SAL_VIDAS'),
    '{' ||
      '"samplingMethodChoices": [' ||
        '{' ||
        '"name": "25gx15S-1C-3375mlBr",' ||
        '"description": "25 grams from each of 15 subs tested as one 375g composite, 3375mls of pre-enriched broth added",' ||
        '"extractedGramsPerSub": 25,' ||
        '"numberOfSubs": 15,' ||
        '"numberOfComposites": 1,' ||
        '"compositeMassGrams": 375,' ||
        '"numberOfSubsPerComposite": 15' ||
        '},' ||
        '{' ||
        '"name": "25gx30S-2C-3375mlBr",' ||
        '"description": "25 grams from each of 30 subs tested as two 375g composites, 3375mls of pre-enriched broth/composite",' ||
        '"extractedGramsPerSub": 25,' ||
        '"numberOfSubs": 30,' ||
        '"numberOfComposites": 2,' ||
        ' "compositeMassGrams": 375,' ||
        ' "numberOfSubsPerComposite": 15' ||
        '}' ||
      ']' ||
    '}'
  );

----------------------------
-- Dummy test data from here

insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name)
  values (234234, 'John.Doe', 'JD', (select id from lab_group where name = 'ARL-MICRO'), 'John', 'Doe', null);

insert into test_type(code, short_name, name)
  values('MICRO_LST', 'Listeria', 'Listeria abbreviated test');

insert into lab_group_test_type (lab_group_id, test_type_id, test_configuration_json)
  values(
    (select id from lab_group where name = 'ARL-MICRO'),
    (select id from test_type where code='MICRO_LST'),
    null);


insert into sample(lab_group_id, sample_num, pac, lid, paf, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received, sampling_org, subject)
  values(1, '123456-0', 'C12345', null, 'MIC', 'Golanga', 'In-progress', CURRENT_DATE-3, CURRENT_TIMESTAMP-2, CURRENT_DATE-4, 'DNTI', 'Adhoc Sample Analysis');
insert into sample (lab_group_id, sample_num, pac, lid, paf, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received, sampling_org)
  values(1, '234567-0', 'C23456', 'M', 'MIC', 'Shrimp Powder', 'In-progress', CURRENT_DATE-4, CURRENT_TIMESTAMP-3, CURRENT_DATE-4, 'HADR4');
insert into sample (lab_group_id, sample_num, pac, lid, paf, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received, sampling_org)
  values(1, '34567-0', 'C33456',  'M', 'MIC', 'Shrimp Tartar', 'Assigned', CURRENT_DATE-5, CURRENT_TIMESTAMP-3, CURRENT_DATE-5, 'REI2');
insert into sample (lab_group_id, sample_num, pac, lid, paf, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received, sampling_org)
  values(1, '595678-0', 'C46567', 'M', 'MIC', 'Steak Powder', 'Assigned', CURRENT_DATE-4, CURRENT_TIMESTAMP-4, CURRENT_DATE-5, 'WER');
insert into sample (lab_group_id, sample_num, pac, lid, paf, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received, sampling_org)
  values(1, '595678-0', 'C46567', 'M', 'MIC', 'Tomato Powder', 'Complete', CURRENT_DATE-15, CURRENT_TIMESTAMP-13, CURRENT_DATE-16, 'DNH1');

insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(1, 1, '22 Jun 2018', 1);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(2, 1, '21 Jun 2018', 0);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(3, 2, '20 Jun 2018', 1);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(4, 1, '24 Jun 2018', 1);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(4, 2, '24 Jun 2018', 0);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(5, 1, '24 Jun 2018', 1);

insert into sample_managed_resource (sample_id, employee_id, list_name, resource_code)
  values(1, 1, 'golanga SLM - Jul 3, 2018', 'ARL00424');
insert into sample_managed_resource (sample_id, employee_id, list_name, resource_code)
  values(1, 1, 'golanga SLM - Jul 3, 2018', 'ARL00190');
insert into sample_managed_resource (sample_id, employee_id, list_name, resource_code)
  values(2, 1, 'shrimp - Jul 5, 2018', 'ARL00424');
insert into sample_managed_resource (sample_id, employee_id, list_name, resource_code)
  values(2, 1, 'shrimp - Jul 5, 2018', 'ARL00190');

insert into sample_unmanaged_resource (sample_id, employee_id, list_name, resource_code, resource_type)
  values(1, 1, 'golanga media - Jul 3, 2018', 'RT-123456', 'MED');
insert into sample_unmanaged_resource (sample_id, employee_id, list_name, resource_code, resource_type)
  values(1, 1, 'golanga media - Jul 3, 2018', 'TT-234567', 'MED');
insert into sample_unmanaged_resource (sample_id, employee_id, list_name, resource_code, resource_type)
  values(1, 1, 'golanga media (additional)', 'RT-654321', 'MED');
insert into sample_unmanaged_resource (sample_id, employee_id, list_name, resource_code, resource_type)
  values(1, 1, 'golanga media (additional)', 'TT-234234', 'MED');

insert into sample_unmanaged_resource (sample_id, employee_id, list_name, resource_code, resource_type)
  values(2, 1, 'shrimp media - Jul 3, 2018', 'RT-234567', 'MED');
insert into sample_unmanaged_resource (sample_id, employee_id, list_name, resource_code, resource_type)
  values(2, 1, 'shrimp media - Jul 3, 2018', 'TT-345678', 'MED');

insert into test
  (lab_group_id, test_type_id, sample_id, begin_date, created, created_by_emp_id,
   last_saved, last_saved_by_emp_id, reviewed_by_emp_id, saved_to_facts)
  values(1, 1, 1, CURRENT_DATE - 2, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, 1, null, null);
insert into test
  (lab_group_id, test_type_id, sample_id, begin_date, created, created_by_emp_id,
   last_saved, last_saved_by_emp_id, note, reviewed_by_emp_id, saved_to_facts)
  values(1, 1, 2, CURRENT_DATE - 3, CURRENT_TIMESTAMP - 2, 1, CURRENT_TIMESTAMP - 2, 1, 'for JM', null, null);
insert into test
(lab_group_id, test_type_id, sample_id, begin_date, created, created_by_emp_id,
 last_saved, last_saved_by_emp_id, reviewed_by_emp_id, saved_to_facts)
  values(1, 2, 1, CURRENT_DATE - 2, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, 1, null, null);
insert into test
(lab_group_id, test_type_id, sample_id, begin_date, created, created_by_emp_id,
 last_saved, last_saved_by_emp_id, note, reviewed_by_emp_id, saved_to_facts)
  values(1, 2, 2, CURRENT_DATE - 3, CURRENT_TIMESTAMP - 2, 1, CURRENT_TIMESTAMP - 2, 1, 'X', null, null);
