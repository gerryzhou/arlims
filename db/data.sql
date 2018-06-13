insert into lab_group (name, address_street, buildings_and_rooms, address_city, address_state, address_zip, description)
  values ('ARL-MICRO', '3900 NCTR Road', 'Building 26', 'Jefferson', 'AR', '72079', 'ARL Labs Microbiology');

insert into employee (username, short_name, lab_group_id, email, last_name, first_name, middle_name)
  values ('sharris', 'SCH', (select id from lab_group where name = 'ARL-MICRO'), 'stephen.harris@fda.hhs.gov','Harris', 'Stephen', 'C');

insert into role(name, description)
  values('USER', 'regular user');
insert into role(name, description)
  values('ADMIN', 'administrator');

insert into employee_role(employee_id, role_id)
  values((select id from employee where username='sharris'),(select id from role where name='USER'));

insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00424', 'BALANCE', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('RT10971', 'WATERBATH', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00190', 'WATERBATH', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00232', 'WATERBATH', (select id from lab_group where name = 'ARL-MICRO'), null);

insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V1-5089993', 'VIDAS', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V2-5099353', 'VIDAS', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V3-5122706', 'VIDAS', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V4-5122707', 'VIDAS', (select id from lab_group where name = 'ARL-MICRO'), null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V5-5099389', 'VIDAS', (select id from lab_group where name = 'ARL-MICRO'), null);

insert into lab_test_type(code, description)
  values('IMP_SAL_VIDAS', 'Imported Salmonella - Vidas');

insert into lab_group_test_type (lab_group_id, test_type_id)
  values((select id from lab_group where name = 'ARL-MICRO'), (select id from lab_test_type where code='IMP-SAL-VIDAS'));
