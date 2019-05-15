insert into lab_group (name, facts_org_name, address_street, buildings_and_rooms, address_city, address_state, address_zip, description)
  values ('ARL-MICRO', 'ARKL', '3900 NCTR Road', 'Building 26', 'Jefferson', 'AR', '72079', 'ARL Labs Microbiology');

insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name, password)
  values (472629, 'stephen.harris', 'SCH', 1, 'Harris', 'Stephen', 'C', '$2a$10$GuY.dmUtyra9IY.UQ8sUqe/sW7c94MSkMiXgYEjrB78R3OyfC2LOK');
insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name, password)
  values (1234568, 'john.doe', 'jdoe', 1, 'Doe', 'John', null, '$2a$10$GuY.dmUtyra9IY.UQ8sUqe/sW7c94MSkMiXgYEjrB78R3OyfC2LOK');
insert into employee (facts_person_id, fda_email_account_name, short_name, lab_group_id, last_name, first_name, middle_name, password)
  values (454522, 'john.ho', 'jho', 1, 'Ho', 'John', null, '$2a$10$9ktSWmGyM8XKoD9Rpvk/JOUUZZ45FU40hmsMX5hpIr61PtKgME6P6');


insert into role(name, description)
  values('ANALYST', 'lab analyst');
insert into role(name, description)
  values('ADMIN', 'administrator');

insert into employee_role(emp_id, role_name)
  values(1,'ANALYST');
insert into employee_role(emp_id, role_name)
  values(1,'ADMIN');
insert into employee_role(emp_id, role_name)
  values(2,'ANALYST');
insert into employee_role(emp_id, role_name)
  values(2,'ADMIN');

-- Add shared resources for ARKL's ARL-MICRO* lab groups.

insert into resource_group(name, description)
  values('ARKL-MICRO-SHARED', 'Shared lab resources for ARL-MICRO* labs');

insert into lab_group_resource_group (lab_group_id, resource_group)
  values(1, 'ARKL-MICRO-SHARED');

insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'ARL00424', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'ARL00266', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'ARL00480', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'NA12596', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'NA12757', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'NA14728', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'NA14961', 'BAL', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'RT10971', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'ARL00190', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'ARL00232', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'RT10968', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'RT10969', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'RT10973', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'RT10975', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'RT10976', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'NA12536', 'WAB', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'V1-5089993', 'VID', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'V2-5099353', 'VID', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'V3-5122706', 'VID', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'V4-5122707', 'VID', null);
insert into "resource"(resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', 'V5-5099389', 'VID', null);
insert into "resource" (resource_group, code, resource_type, description)
  values('ARKL-MICRO-SHARED', '5099365', 'INC', null);
insert into "resource" (resource_group, code, resource_type, description)
  values ('ARKL-MICRO-SHARED', '5099360', 'INC', null);
insert into "resource" (resource_group, code, resource_type, description)
  values ('ARKL-MICRO-SHARED', '5099361', 'INC', null);
insert into "resource" (resource_group, code, resource_type, description)
  values ('ARKL-MICRO-SHARED', '5099391', 'INC', null);

insert into test_type(code, short_name, name)
  values('MICRO_SLM', 'SALMONELLA', 'Salmonella');

insert into lab_group_test_type (lab_group_id, test_type_id, test_configuration_json, report_names_bar_sep)
  values(
    1,
    1,
    make_json('{' ||
      '"samplingMethodChoices": [' ||
        '{' ||
        '"name": "25gx15S-1C-3375mlBr",' ||
        '"description": "25 grams from each of 15 subs tested as one 375g composite, 3375mls of pre-enriched broth added",' ||
        '"extractedGramsPerSub": 25,' ||
        '"numberOfSubsPerComposite": 15,' ||
        '"testUnitsCount": 1,' ||
        '"testUnitsType": "composite"' ||
        '},' ||
        '{' ||
        '"name": "25gx30S-2C-3375mlBr",' ||
        '"description": "25 grams from each of 30 subs tested as two 375g composites, 3375mls of pre-enriched broth/composite",' ||
        '"extractedGramsPerSub": 25,' ||
        '"numberOfSubsPerComposite": 15,' ||
        '"testUnitsCount": 2,' ||
        '"testUnitsType": "composite"' ||
        '}' ||
      '],' ||
      '"aoacMethodCode":"T2004.03",' ||
      '"spikeSpeciesText": "S. cerro",' ||
      '"spikeKitRemarksText": "7 CFUs on blood agar"' ||
    '}'),
    'imp_slm_vidas.pdf'
  );

insert into test_type_search_scope (test_type_id, scope_name, scope_descr, search_fields)
  values(1, 'media', 'search media lot identifiers',
    make_json(
        '[' ||
            '{"keyPath": ["preEnrData", "mediumBatchId"], "fieldType": "STR"}' ||
           ',{"keyPath": ["selEnrData", "rvBatchId"],     "fieldType": "STR"}' ||
           ',{"keyPath": ["selEnrData", "ttBatchId"],     "fieldType": "STR"}' ||
           ',{"keyPath": ["selEnrData", "bgBatchId"],     "fieldType": "STR"}' ||
           ',{"keyPath": ["selEnrData", "i2kiBatchId"],   "fieldType": "STR"}' ||
           ',{"keyPath": ["mBrothData", "mBrothBatchId"], "fieldType": "STR"}' ||
        ']'
    )
  );



