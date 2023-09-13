/*
 Navicat Premium Data Transfer

 Source Server         : Project_Inventory
 Source Server Type    : Oracle
 Source Server Version : 190000 (Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production)
 Source Schema         : INVENTORY

 Target Server Type    : Oracle
 Target Server Version : 190000 (Oracle Database 19c Enterprise Edition Release 19.0.0.0.0 - Production)
 File Encoding         : 65001

 Date: 12/09/2023 19:41:11
*/


-- ----------------------------
-- Table structure for TEMP_ORDER
-- ----------------------------
DROP TABLE "INVENTORY"."TEMP_ORDER";
CREATE TABLE "INVENTORY"."TEMP_ORDER" (
  "TEMP_O_ID" NUMBER VISIBLE NOT NULL,
  "C_ID" NUMBER VISIBLE NOT NULL,
  "PLACE_DATE" DATE VISIBLE NOT NULL,
  "SHIPPING_ADDRESS" VARCHAR2(255 BYTE) VISIBLE NOT NULL,
  "BKASH_MOB_NO" NUMBER(11,0) VISIBLE NOT NULL,
  "BKASH_TRANS_ID" VARCHAR2(255 BYTE) VISIBLE NOT NULL,
  "TOTAL_EXPENSE" NUMBER VISIBLE NOT NULL,
  "E_ID" NUMBER VISIBLE NOT NULL
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Records of TEMP_ORDER
-- ----------------------------
INSERT INTO "INVENTORY"."TEMP_ORDER" VALUES ('229', '1', TO_DATE('2023-09-11 16:39:45', 'SYYYY-MM-DD HH24:MI:SS'), 'Tanvirul Islam Turad, Dhaka, , Dhaka, , 1000, BD', '1234566789', 'THX234ASD', '11504.509999999998', '1');
INSERT INTO "INVENTORY"."TEMP_ORDER" VALUES ('225', '1', TO_DATE('2023-09-11 14:00:01', 'SYYYY-MM-DD HH24:MI:SS'), 'Tanvirul Islam Turad, Dhaka, , Dhaka, , 1000, BD', '1303516480', 'THX234ASD', '1205269.8800000001', '3');
INSERT INTO "INVENTORY"."TEMP_ORDER" VALUES ('227', '1', TO_DATE('2023-09-11 15:46:35', 'SYYYY-MM-DD HH24:MI:SS'), 'Tanvirul Islam Turad, Dhaka, , Dhaka, , 1000, BD', '1303516434', 'CfgbRyfEDRTGH', '849.77', '2');

-- ----------------------------
-- Primary Key structure for table TEMP_ORDER
-- ----------------------------
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008041" PRIMARY KEY ("TEMP_O_ID");

-- ----------------------------
-- Checks structure for table TEMP_ORDER
-- ----------------------------
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008033" CHECK ("TEMP_O_ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008034" CHECK ("C_ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008035" CHECK ("PLACE_DATE" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008036" CHECK ("SHIPPING_ADDRESS" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008037" CHECK ("BKASH_MOB_NO" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008038" CHECK ("BKASH_TRANS_ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008039" CHECK ("TOTAL_EXPENSE" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE "INVENTORY"."TEMP_ORDER" ADD CONSTRAINT "SYS_C008040" CHECK ("E_ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
