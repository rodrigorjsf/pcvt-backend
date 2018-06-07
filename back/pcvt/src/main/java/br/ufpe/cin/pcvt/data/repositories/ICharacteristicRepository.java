package br.ufpe.cin.pcvt.data.repositories;

import br.ufpe.cin.pcvt.data.models.characteristics.Characteristic;
import br.ufpe.cin.pcvt.data.models.threats.Threat;

import java.util.List;
import java.util.Set;

public interface ICharacteristicRepository {

    Characteristic insert(Characteristic characteristic);
    Characteristic get(Integer key);
    void remove(Integer key) throws Exception;
    Characteristic update(Characteristic characteristic);
    List<Characteristic> all();

    Set<Threat> getThreatsByCharacteristicId(List<Integer> ids);
}