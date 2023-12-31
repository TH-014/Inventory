CREATE OR REPLACE TRIGGER INS_PRODUCT
BEFORE INSERT
ON PRODUCT
FOR EACH ROW
DECLARE
	TEMP NUMBER;
	SIZE_CC NUMBER;
	PTYPE VARCHAR2(255);
	QTY NUMBER;
BEGIN
	SELECT "P_SIZE(CC)", "PREFERRED_TEMP(C)", "QUANTITY" INTO SIZE_CC, TEMP, QTY
	FROM SUPPLIES
	WHERE P_ID = :NEW.P_ID;
	:NEW.REMAINING_ITEM := QTY;
	:NEW.SOLD_QUANTITY := 0;
	FOR Y IN (SELECT * FROM "STORAGE") LOOP
			IF(:NEW.TYPE = Y."TYPE" AND (TEMP BETWEEN Y.MIN_TEMP AND Y.MAX_TEMP)) THEN
					:NEW.PER_UNIT_CHARGE := SIZE_CC * Y.PER_VOL_COST;
					:NEW.STORAGE_ID := Y.ST_ID;
			END IF; 
	END LOOP;
END;
/


CREATE OR REPLACE TRIGGER UPD_STORAGE_SPACE
AFTER INSERT
ON PRODUCT
FOR EACH ROW
DECLARE
	SIZE_CC NUMBER;
	QTY NUMBER;
	CAPSP NUMBER;
BEGIN
	SELECT "P_SIZE(CC)", QUANTITY INTO SIZE_CC, QTY
	FROM SUPPLIES
	WHERE P_ID = :NEW.P_ID;
	CAPSP := SIZE_CC * QTY;
	UPDATE STORAGE
	SET CAPTURED_SPACE = CAPTURED_SPACE + CAPSP
	WHERE ST_ID = :NEW.STORAGE_ID;
END;
/

CREATE OR REPLACE TRIGGER UPD_REDUCED_SPACE
AFTER DELETE
ON PRODUCT
FOR EACH ROW
DECLARE
	SIZE_CC NUMBER;
	QTY NUMBER;
	CAPSP NUMBER;
BEGIN
	SELECT "P_SIZE(CC)", QUANTITY INTO SIZE_CC, QTY
	FROM SUPPLIES
	WHERE P_ID = :OLD.P_ID;
	CAPSP := SIZE_CC * QTY;
	UPDATE STORAGE
	SET CAPTURED_SPACE = CAPTURED_SPACE - CAPSP
	WHERE ST_ID = :OLD.STORAGE_ID;
END;
/

CREATE OR REPLACE TRIGGER INS_CHARGES
AFTER INSERT
ON PRODUCT
FOR EACH ROW
DECLARE
	SID NUMBER;
	DC NUMBER;
BEGIN
	SELECT S_ID INTO SID
	FROM SUPPLIES
	WHERE P_ID = :NEW.P_ID;
	DC := :NEW.PER_UNIT_CHARGE * :NEW.REMAINING_ITEM;
	INSERT INTO CHARGES VALUES (:NEW.P_ID, SID, 0, SYSDATE, DC);
END;
/

CREATE OR REPLACE TRIGGER DEL_CHARGES
AFTER DELETE
ON PRODUCT
FOR EACH ROW
DECLARE
BEGIN
	DELETE FROM CHARGES WHERE P_ID = :OLD.P_ID;
END;
/

CREATE OR REPLACE TRIGGER UPD_CHARGES
AFTER UPDATE
OF REMAINING_ITEM
ON PRODUCT
FOR EACH ROW
DECLARE
	D NUMBER;
	DC NUMBER;
	CUR_DC NUMBER;
	DATE1 DATE;
	CUR_DUE NUMBER;
	PRV_DUE NUMBER;
BEGIN
	SELECT "LAST_UPDATED_ON", "DAILY_CHARGE", "DUE" INTO DATE1, DC, PRV_DUE
	FROM "CHARGES" WHERE "P_ID" = :NEW.P_ID;
	D := SYSDATE - DATE1;
	CUR_DUE := D*DC + PRV_DUE;
	CUR_DC := :NEW.REMAINING_ITEM* :NEW.PER_UNIT_CHARGE;
	UPDATE "CHARGES" SET "DAILY_CHARGE" = CUR_DC, "DUE" = CUR_DUE, "LAST_UPDATED_ON" = SYSDATE WHERE "P_ID" = :NEW.P_ID;
END;
/