insert into lab_group (name, address_street, buildings_and_rooms, address_city, address_state, address_zip, description)
  values ('ARL-MICRO', '3900 NCTR Road', 'Building 26', 'Jefferson', 'AR', '72079', 'ARL Labs Microbiology');

insert into employee (short_name, lab_group_id, email, last_name, first_name, middle_name)
  values ('SCH', (select id from lab_group where name = 'ARL-MICRO'), 'stephen.harris@fda.hhs.gov','Harris', 'Stephen', 'C');

insert into role(name, description)
  values('USER', 'regular user');
insert into role(name, description)
  values('ADMIN', 'administrator');

insert into employee_role(emp_id, role_id)
  values((select id from employee where short_name='SCH'),(select id from role where name='USER'));

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
  values('IMP_SAL_VIDAS', 'Imported Salmonella - Vidas');

insert into lab_group_test_type (lab_group_id, test_type_id)
  values((select id from lab_group where name = 'ARL-MICRO'), (select id from test_type where code='IMP_SAL_VIDAS'));
