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

insert into test_type(code, name)
  values('MICRO_IMP_SAL_VIDAS', 'Imported Salmonella - Vidas');

insert into lab_group_test_type (lab_group_id, test_type_id)
  values((select id from lab_group where name = 'ARL-MICRO'), (select id from test_type where code='MICRO_IMP_SAL_VIDAS'));

/* TODO
{
   "samplingMethodChoices": [
      {
         name: '25gx15S-1C-3375mlBr',
         description: '25 grams from each of 15 subs tested as one 375g composite, 3375mls of pre-enriched broth added',
         extractedGramsPerSub: 25,
         numberOfSubs: 15,
         numberOfComposites: 1,
         compositeMassGrams: 375,
         numberOfSubsPerComposite: 15
      },
      {
         name: '25gx30S-2C-3375mlBr',
         description: '25 grams from each of 30 subs tested as two 375g composites, 3375mls of pre-enriched broth/composite',
         extractedGramsPerSub: 25,
         numberOfSubs: 30,
         numberOfComposites: 2,
         compositeMassGrams: 375,
         numberOfSubsPerComposite: 15
      },
   ]
}
 */

-- dummy test data
insert into sample (lab_group_id, sample_num, pac, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received)
  values(1, '123456-0', 'C12345', 'Golanga', 'Assigned', '22 Jun 2018', CURRENT_TIMESTAMP-2, '21 Jun 2018');
insert into sample (lab_group_id, sample_num, pac, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received)
  values(1, '234567-0', 'C23456', 'Shrimp Powder', 'Assigned', '21 Jun 2018', CURRENT_TIMESTAMP-3, '20 Jun 2018');
insert into sample (lab_group_id, sample_num, pac, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received)
  values(1, '34567-0', 'C33456', 'Shrimp Tartar', 'In-progress', '21 Jun 2018', CURRENT_TIMESTAMP-3, '20 Jun 2018');
insert into sample (lab_group_id, sample_num, pac, product_name, facts_status, facts_status_date, last_refreshed_from_facts, received)
  values(1, '595678-0', 'C46567', 'Steak Powder', 'Complete', '2 Jun 2018', CURRENT_TIMESTAMP-13, '2 Jun 2018');

insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(1, 1, '22 Jun 2018', 1);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(2, 1, '21 Jun 2018', 0);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(3, 1, '20 Jun 2018', 1);
insert into sample_assignment(sample_id, employee_id, assigned_date, lead)
  values(4, 1, '24 Jun 2018', 1);

insert into test
  (lab_group_id, test_type_id, sample_id, begin_date, created, created_by_emp_id,
   last_saved, last_saved_by_emp_id, reviewed_by_emp_id, saved_to_facts)
values(1, 1, 1, '27 Jun 2018', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, 1, null, null);
insert into test
  (lab_group_id, test_type_id, sample_id, begin_date, created, created_by_emp_id,
   last_saved, last_saved_by_emp_id, note, reviewed_by_emp_id, saved_to_facts)
values(1, 1, 2, '26 Jun 2018', CURRENT_TIMESTAMP - 2, 1, CURRENT_TIMESTAMP - 2, 1, 'for JM', null, null);

