insert into sample_pack (facts_sample_id, facts_pack_id, product_name, received, is_imported)
  values('1234567', 'C9023X', 'Golangas', '20 May, 2017', 'Y');
insert into sample_pack (facts_sample_id, facts_pack_id, product_name, received, is_imported)
  values('2345678', 'D3355Y', 'Bazanga Powder', '2 Mar, 2017', 'Y');
insert into sample_pack (facts_sample_id, facts_pack_id, product_name, received, is_imported)
  values('3123451', 'C7333A', 'Golangas', '20 May, 2017', 'Y');
insert into sample_pack (facts_sample_id, facts_pack_id, product_name, received, is_imported)
  values('8765432', 'D3345Y', 'Bazanga Powder Extended', '2 Mar, 2017', 'Y');

insert into medium_batch (id, med_type, expiration_date)
  values('RV918264816', 'RV', '12 Jun, 2020');
insert into medium_batch (id, med_type, expiration_date)
  values('TT918264816', 'TT', '2 Jul, 2019');
insert into medium_batch (id, med_type, expiration_date)
  values('RV123211111', 'RV', '1 Jun, 2021');
insert into medium_batch (id, med_type, expiration_date)
  values('TT642948816', 'TT', '1 Jul, 2018');

insert into incubator(id, description) values('INC000012100', 'INC-224-LEFT');
insert into incubator(id, description) values('INC000012200', 'INC-224-RIGHT');

insert into water_bath(id, description) values('WB000082100', 'WB-220-1');
insert into water_bath(id, description) values('WB000082200', 'WB-220-2');

insert into balance(id, description) values('BL000082100', 'BAL-224-1');
insert into balance(id, description) values('BL000082200', 'BAL-224-2');

insert into jar(id, description) values('JR000082100', 'JAR-224-1');
insert into jar(id, description) values('JR000082200', 'JAR-224-2');

insert into bag(id, description) values('BG000082100', 'BAG-224-1');
insert into bag(id, description) values('BG000082200', 'BAG-224-2');

insert into vidas(id, description) values('VID001', 'VID-1');
insert into vidas(id, description) values('VID002', 'VID-2');
insert into vidas(id, description) values('VID003', 'VID-3');
insert into vidas(id, description) values('VID004', 'VID-4');
insert into vidas(id, description) values('VID005', 'VID-5');
insert into vidas(id, description) values('VID006', 'VID-6');

insert into vidas_kit(id, description) values('VK001', 'VIDKIT-1');
insert into vidas_kit(id, description) values('VK002', 'VIDKIT-2');
insert into vidas_kit(id, description) values('VK003', 'VIDKIT-3');

insert into sample_pack_assignment (sample_id, pack_id, analyst_id)
  values('1234567', 'C9023X', 'AA');
insert into sample_pack_assignment (sample_id, pack_id, analyst_id)
  values('2345678', 'D3355Y', 'JM');
insert into sample_pack_assignment (sample_id, pack_id, analyst_id)
  values('3123451', 'C7333A', 'AA');

insert into imp_sal_test (sample_id, pack_id)
  values('1234567', 'C9023X');
insert into imp_sal_test (sample_id, pack_id)
  values('3123451', 'C7333A');

