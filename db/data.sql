insert into lab_group (name, facts_org_name, facts_parent_org_name, address_street, buildings_and_rooms, address_city, address_state, address_zip, description)
  values ('ARL-MICRO1', 'ARL-MICRO1', 'ARKL', '3900 NCTR Road', 'Building 26', 'Jefferson', 'AR', '72079', 'ARL Labs Microbiology');

insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name, password)
  values (472629, 'stephen.harris', 'SCH', 1, 'Harris', 'Stephen', 'C', '$2a$10$GuY.dmUtyra9IY.UQ8sUqe/sW7c94MSkMiXgYEjrB78R3OyfC2LOK');
insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name, password)
  values (1234568, 'john.doe', 'jdoe', 1, 'Doe', 'John', null, '$2a$10$GuY.dmUtyra9IY.UQ8sUqe/sW7c94MSkMiXgYEjrB78R3OyfC2LOK');

insert into role(name, description)
  values('USER', 'regular user');
insert into role(name, description)
  values('ADMIN', 'administrator');

insert into employee_role(emp_id, role_id)
  values(1,1);
insert into employee_role(emp_id, role_id)
  values(1,2);

insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00424', 'BAL', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('RT10971', 'WAB', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00190', 'WAB', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('ARL00232', 'WAB', 1, null);

insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V1-5089993', 'VID', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V2-5099353', 'VID', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V3-5122706', 'VID', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V4-5122707', 'VID', 1, null);
insert into lab_resource(code, resource_type, lab_group_id, description)
  values('V5-5099389', 'VID', 1, null);

insert into test_type(code, short_name, name)
  values('MICRO_IMP_SAL_VIDAS', 'IMP SLM VIDAS', 'Imported Salmonella - Vidas');

insert into lab_group_test_type (lab_group_id, test_type_id, test_configuration_json, report_names_bar_sep)
  values(
    1,
    1,
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
    '}',
    'imp_slm_vidas.pdf'
  );

-- insert into sample_op(lab_group_id, sample_tracking_num, sample_tracking_sub_num,
--                    pac, lid, paf, product_name, facts_status, facts_status_timestamp, last_refreshed_from_facts,
--                    sampling_org, subject, operation_code, work_id, sample_analysis_id, work_request_id)
--   values(1, 123456, 0, 'C12345', null, 'MIC', 'Golanga', 'I', CURRENT_DATE-3, CURRENT_TIMESTAMP-2,
--          'DNTI', 'Adhoc Sample Analysis', 41, 6771183, 893080, 1572599);

