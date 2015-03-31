#!/bin/sh

#move to the coolwind directory and get an array of the DBF files within
cd /mnt/coolwind/g/coolwind
shopt -s nullglob
dbfFiles=(*.dbf)
shopt -u nullglob

for i in "${dbfFiles[@]}"
do
    truncName=${i%.*}
    echo "Copying database $truncName"
    fptName="/mnt/coolwind/g/coolwind/$truncName.fpt"
    fptCommand=""
    
    if [ -e "$fptName" ]; then
        fptCommand="-m $fptName"
    fi
    
    pgdbf -s latin1 $fptCommand /mnt/coolwind/g/coolwind/$truncName.dbf | psql 'postgresql://jbadmin:pg1pg2!+c0013R@127.0.0.1/jbdev' 2>&1 1>/dev/null   
done
